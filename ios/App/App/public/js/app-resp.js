let breathInterval;
let timeoutId;

function avviaRespiro() {
    // Mostra la schermata della respirazione
    const overlay = document.getElementById('breathOverlay');
    overlay.style.display = 'flex';
    
    // Inizia il ciclo
    cicloRespirazione();
}

function chiudiRespiro() {
    // Nasconde la schermata e resetta i timer
    document.getElementById('breathOverlay').style.display = 'none';
    clearInterval(breathInterval);
    clearTimeout(timeoutId);
    
    // Resetta il cerchio
    const circle = document.getElementById('breathCircle');
    circle.style.transform = 'scale(1)';
}

function cicloRespirazione() {
    const textEl = document.getElementById('breathText');
    const circleEl = document.getElementById('breathCircle');
    const timerEl = document.getElementById('breathTimer');
    
    // --- FASE 1: INSPIRA (4 secondi) ---
    textEl.innerText = "Inspira dal naso...";
    circleEl.style.transition = "transform 4s linear";
    circleEl.style.transform = "scale(1.6)"; // Il cerchio si ingrandisce
    countdown(4, timerEl, () => {
        
        // --- FASE 2: TRATIENI (7 secondi) ---
        textEl.innerText = "Trattieni...";
        // Non cambiamo la scala, il cerchio resta fermo
        countdown(7, timerEl, () => {
            
            // --- FASE 3: ESPIRA (8 secondi) ---
            textEl.innerText = "Espira lentamente dalla bocca...";
            circleEl.style.transition = "transform 8s linear";
            circleEl.style.transform = "scale(1)"; // Il cerchio torna piccolo
            countdown(8, timerEl, () => {
                
                // Ricomincia il ciclo all'infinito finché non fa "Chiudi"
                cicloRespirazione();
            });
        });
    });
}

// Funzione di supporto per gestire il conteggio dei secondi
function countdown(secondi, elementoTimer, callback) {
    let tempoRimasto = secondi;
    elementoTimer.innerText = tempoRimasto;
    
    clearInterval(breathInterval);
    breathInterval = setInterval(() => {
        tempoRimasto--;
        elementoTimer.innerText = tempoRimasto;
        
        if (tempoRimasto <= 0) {
            clearInterval(breathInterval);
            callback();
        }
    }, 1000);
}