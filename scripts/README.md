# scripts/

## notify_done.py

Postet eine Status-Nachricht an einen OpenAI-Assistants-Thread, der als
laufendes Log über alle Phasen dient.

### Setup (einmalig)

1. OpenAI-API-Key als Env-Variable setzen (Windows):
   ```cmd
   setx OPENAI_API_KEY "sk-proj-..."
   ```
   Danach neue Shell öffnen, damit die Variable sichtbar ist.

2. Testlauf:
   ```bash
   python scripts/notify_done.py --phase "Setup" --summary "notify pipeline online"
   ```
   Beim ersten Lauf wird ein Thread erstellt und seine ID in
   `scripts/.notify_state.json` (gitignored) gespeichert. Die Playground-URL
   wird in stdout ausgegeben.

### Nutzung nach jeder Phase

```bash
python scripts/notify_done.py \
  --phase "Phase 3" \
  --commit fc21917 \
  --files sections/blechziegel-home.liquid \
  --summary "Hero fact tiles + navy final CTA rebuilt"
```

### Sicherheit

- Der Key wird **nur** aus `OPENAI_API_KEY` gelesen, nie ins Repo geschrieben.
- `scripts/.notify_state.json` enthält nur die Thread-ID und ist gitignored.
- Kein AI-Run wird gestartet — es werden nur Messages in den Thread gepostet
  (keine Token-Kosten über Message-Storage hinaus).
