#!/usr/bin/env python3
"""Post a phase-complete status message to an OpenAI Assistants thread.

Reads OPENAI_API_KEY from the environment. Persists the thread id in
scripts/.notify_state.json (gitignored) so subsequent runs append to the
same running log.

Usage:
    python scripts/notify_done.py \
        --phase "Phase 3" \
        --commit fc21917 \
        --summary "Hero fact tiles + navy final CTA rebuilt" \
        --files sections/blechziegel-home.liquid

On first run it creates a new thread and prints its id. Open it in the
OpenAI Playground to follow the log:
    https://platform.openai.com/playground/assistants?thread=<THREAD_ID>
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

API_ROOT = "https://api.openai.com/v1"
STATE_PATH = Path(__file__).resolve().parent / ".notify_state.json"


def _request(method: str, path: str, payload: dict | None = None) -> dict:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        sys.exit("OPENAI_API_KEY is not set in the environment.")

    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        API_ROOT + path,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        sys.exit(f"HTTP {exc.code} on {method} {path}: {body}")
    except urllib.error.URLError as exc:
        sys.exit(f"Network error on {method} {path}: {exc}")


def _load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {}


def _save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


def ensure_thread() -> str:
    state = _load_state()
    if state.get("thread_id"):
        return state["thread_id"]
    thread = _request("POST", "/threads", {})
    state["thread_id"] = thread["id"]
    state["created_at"] = _dt.datetime.now(_dt.timezone.utc).isoformat()
    _save_state(state)
    print(f"[notify] created thread {thread['id']}", file=sys.stderr)
    return thread["id"]


def post_message(phase: str, commit: str, summary: str, files: str) -> None:
    thread_id = ensure_thread()
    now = _dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [f"[{now}] {phase} — complete"]
    if commit:
        lines.append(f"Commit: {commit}")
    if files:
        lines.append(f"Files: {files}")
    lines.append("")
    lines.append(summary)
    content = "\n".join(lines)

    _request(
        "POST",
        f"/threads/{thread_id}/messages",
        {"role": "user", "content": content},
    )
    print(f"[notify] posted to thread {thread_id}")
    print(
        "[notify] view at "
        f"https://platform.openai.com/playground/assistants?thread={thread_id}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--phase", required=True, help="Phase or task label")
    parser.add_argument("--commit", default="", help="Commit SHA (optional)")
    parser.add_argument("--summary", required=True, help="Short summary")
    parser.add_argument("--files", default="", help="Changed files (optional)")
    args = parser.parse_args()
    post_message(args.phase, args.commit, args.summary, args.files)


if __name__ == "__main__":
    main()
