function avviaDiario() {
    const overlay = document.getElementById('diaryOverlay');
    const input = document.getElementById('diaryInput');
    const statusEl = document.getElementById('saveStatus');

    if (!overlay || !input || !statusEl) return;

    overlay.style.display = 'flex';

    try {
        const testoPrecedente = localStorage.getItem('diarioSegreto');
        if (testoPrecedente) {
            input.value = testoPrecedente;
        }
    } catch (error) {
        console.warn('Impossibile leggere il diario salvato:', error);
    }

    statusEl.innerText = 'Tutto salvato in locale';
    setTimeout(() => input.focus(), 100);
}

function chiudiDiario() {
    const overlay = document.getElementById('diaryOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function salvaDiario() {
    const input = document.getElementById('diaryInput');
    const statusEl = document.getElementById('saveStatus');

    if (!input || !statusEl) return;

    const testo = input.value;

    try {
        localStorage.setItem('diarioSegreto', testo);
    } catch (error) {
        console.warn('Impossibile salvare il diario:', error);
        statusEl.innerText = 'Salvataggio non disponibile';
        return;
    }

    statusEl.innerText = 'Sto salvando...';

    clearTimeout(window.diarySaveTimer);
    window.diarySaveTimer = setTimeout(() => {
        statusEl.innerText = 'Tutto salvato in locale';
    }, 500);
}