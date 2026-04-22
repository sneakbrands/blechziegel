/*
 * bz-customer-type.js
 * Toggelt den Steuer-Hinweis (#bz-price-note) bei Varianten-Wechsel.
 * Liest data-tax-long aus dem aktiv gewählten .bz-segment-input.
 * Kein String-Vergleich auf Kundentyp-Werte — voll datengetrieben.
 */
(function () {
  function updateTaxNote() {
    var selected = document.querySelector('.bz-segment-input:checked');
    if (!selected) return;

    var note = document.getElementById('bz-price-note');
    if (note) {
      var taxLong = selected.getAttribute('data-tax-long') || '';
      note.textContent = taxLong;
      note.dataset.customerType = selected.value || '';
    }

    var projectNote = document.getElementById('bz-project-note');
    if (projectNote) {
      var show = selected.getAttribute('data-show-project-note') === 'true';
      projectNote.style.display = show ? '' : 'none';
    }
  }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('bz-segment-input')) {
      updateTaxNote();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTaxNote);
  } else {
    updateTaxNote();
  }

  // Öffentliche Hook für Theme-Code, das nach Variantenwechsel re-triggert.
  window.bzSyncCustomerTypeNote = updateTaxNote;
})();
