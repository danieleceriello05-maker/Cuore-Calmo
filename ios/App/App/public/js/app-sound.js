let audioCorrente = null;
let idTracciaCorrente = null;
let audioContext = null;
let masterGain = null;
let nodiAttivi = [];

const tracceAudio = {
    fortunabase: { file: 'sound/La Fortuna che ho - Base.mp3' },
    'fortuna': { file: 'sound/La fortuna che ho.mp3' },
    dany: { file: 'sound/voce-daniele.mp3' },
};

function avviaSuoni() {
    document.getElementById('audioOverlay').style.display = 'flex';
}

function chiudiSuoni() {
    document.getElementById('audioOverlay').style.display = 'none';
    stopAudio();
    resettareBottoni();
}

async function toggleAudio(idTraccia) {
    const bottone = document.getElementById(`btn-${idTraccia}`);

    if (idTracciaCorrente === idTraccia && audioCorrente) {
        if (!audioCorrente.paused) {
            pauseAudio();
            aggiornaStatoBottoni(idTraccia, false);
        } else {
            resumeAudio();
            aggiornaStatoBottoni(idTraccia, true);
        }
        return;
    }

    if (audioCorrente) {
        stopAudio();
    }

    resettareBottoni();

    try {
        await inizializzaAudio();
        const traccia = tracceAudio[idTraccia] || {};

        if (traccia.file) {
            await avviaFileAudio(traccia.file, idTraccia);
        } else {
            avviaTraccia(idTraccia);
        }

        idTracciaCorrente = idTraccia;
        aggiornaStatoBottoni(idTraccia, true);
    } catch (error) {
        console.error('Errore audio:', error);
        try {
            await inizializzaAudio();
            avviaTraccia(idTraccia);
            idTracciaCorrente = idTraccia;
            aggiornaStatoBottoni(idTraccia, true);
        } catch (fallbackError) {
            console.error('Fallback audio non disponibile:', fallbackError);
            aggiornaStatoBottoni(null, false);
            idTracciaCorrente = null;
            audioCorrente = null;
        }
    }
}

function inizializzaAudio() {
    if (!audioContext) {
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) {
            throw new Error('Il browser non supporta Web Audio API');
        }

        audioContext = new AudioContextCtor();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.08;
        masterGain.connect(audioContext.destination);
    }

    if (audioContext.state === 'suspended') {
        return audioContext.resume();
    }

    return Promise.resolve();
}

async function avviaFileAudio(fileSorgente, idTraccia) {
    const audioElement = new Audio(fileSorgente);
    audioElement.loop = true;

    try {
        await audioElement.play();
        audioCorrente = {
            tipo: 'file',
            elemento: audioElement,
            paused: false,
            id: idTraccia
        };
    } catch (error) {
        throw error;
    }
}

function avviaTraccia(idTraccia) {
    stopNodiAttivi();

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.04;
    gainNode.connect(masterGain);

    if (idTraccia === 'pioggia') {
        const filterNode = audioContext.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 900;
        filterNode.connect(gainNode);

        const oscillatore = audioContext.createOscillator();
        oscillatore.type = 'sine';
        oscillatore.frequency.value = 220;
        oscillatore.connect(filterNode);

        const lfo = audioContext.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.25;
        const lfoGain = audioContext.createGain();
        lfoGain.gain.value = 60;
        lfo.connect(lfoGain);
        lfoGain.connect(oscillatore.frequency);

        oscillatore.start();
        lfo.start();

        nodiAttivi.push(oscillatore, lfo, lfoGain, filterNode, gainNode);
    } else if (idTraccia === 'rumore-bianco') {
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
        const dati = buffer.getChannelData(0);
        for (let i = 0; i < dati.length; i++) {
            dati[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gainNode);
        source.start();

        nodiAttivi.push(source, gainNode);
    } else if (idTraccia === 'natura') {
        const oscillatore1 = audioContext.createOscillator();
        oscillatore1.type = 'triangle';
        oscillatore1.frequency.value = 440;
        oscillatore1.connect(gainNode);

        const oscillatore2 = audioContext.createOscillator();
        oscillatore2.type = 'sine';
        oscillatore2.frequency.value = 660;
        oscillatore2.connect(gainNode);

        const lfo = audioContext.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.12;
        const lfoGain = audioContext.createGain();
        lfoGain.gain.value = 80;
        lfo.connect(lfoGain);
        lfoGain.connect(oscillatore2.frequency);

        oscillatore1.start();
        oscillatore2.start();
        lfo.start();

        nodiAttivi.push(oscillatore1, oscillatore2, lfo, lfoGain, gainNode);
    }

    audioCorrente = {
        tipo: 'sintetico',
        paused: false,
        gainNode: gainNode,
        volume: 0.04,
        id: idTraccia
    };
}

function pauseAudio() {
    if (!audioCorrente || audioCorrente.paused) return;
    audioCorrente.paused = true;

    if (audioCorrente.tipo === 'file' && audioCorrente.elemento) {
        audioCorrente.elemento.pause();
        return;
    }

    audioCorrente.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    audioCorrente.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
}

function resumeAudio() {
    if (!audioCorrente || !audioCorrente.paused) return;
    audioCorrente.paused = false;

    if (audioCorrente.tipo === 'file' && audioCorrente.elemento) {
        audioCorrente.elemento.play().catch(() => {});
        return;
    }

    audioCorrente.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    audioCorrente.gainNode.gain.setValueAtTime(audioCorrente.volume, audioContext.currentTime);
}

function stopAudio() {
    if (!audioCorrente) return;

    if (audioCorrente.tipo === 'file' && audioCorrente.elemento) {
        audioCorrente.elemento.pause();
        audioCorrente.elemento.currentTime = 0;
    } else if (audioCorrente.gainNode) {
        audioCorrente.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        audioCorrente.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        try {
            audioCorrente.gainNode.disconnect();
        } catch (error) {
            console.warn('Errore disconnessione gain:', error);
        }
    }

    stopNodiAttivi();
    audioCorrente = null;
    idTracciaCorrente = null;
}

function stopNodiAttivi() {
    nodiAttivi.forEach(nodo => {
        try {
            nodo.disconnect();
        } catch (error) {
            // Ignora errori di disconnessione già chiusi
        }
        if (typeof nodo.stop === 'function') {
            try {
                nodo.stop();
            } catch (error) {
                // Ignora errori di stop già eseguito
            }
        }
    });
    nodiAttivi = [];
}

function resettareBottoni() {
    const bottoni = document.querySelectorAll('.play-btn');
    bottoni.forEach(btn => {
        btn.innerText = "▶";
        btn.classList.remove('playing');
    });
    idTracciaCorrente = null;
}

function aggiornaStatoBottoni(idTraccia, isPlaying) {
    const bottoni = document.querySelectorAll('.play-btn');
    bottoni.forEach(btn => {
        const dovrebbeEssereAttivo = btn.id === `btn-${idTraccia}`;
        btn.innerText = dovrebbeEssereAttivo && isPlaying ? "⏸" : "▶";
        btn.classList.toggle('playing', dovrebbeEssereAttivo && isPlaying);
    });
}