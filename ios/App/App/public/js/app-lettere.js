// Configura il lavoratore di PDF.js solo se la libreria è disponibile
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';
}

function risolviUrlPdf(urlFilePDF) {
    try {
        return new URL(urlFilePDF, window.location.href).href;
    } catch (errore) {
        console.warn('Impossibile risolvere il percorso del PDF:', errore);
        return urlFilePDF;
    }
}

function ottieniPdfOffline(urlFilePDF) {
    const chiave = urlFilePDF.replace(/^\.\//, '').replace(/^\//, '');
    if (window.LETTERE_OFFLINE_PDF && window.LETTERE_OFFLINE_PDF[chiave]) {
        return { tipo: 'base64', dati: window.LETTERE_OFFLINE_PDF[chiave] };
    }
    if (window.LETTERE_OFFLINE_PDF && window.LETTERE_OFFLINE_PDF[urlFilePDF]) {
        return { tipo: 'base64', dati: window.LETTERE_OFFLINE_PDF[urlFilePDF] };
    }
    return null;
}

function mostraPdfInIframe(paperEl, pdfUrl) {
    paperEl.innerHTML = '';
    const frame = document.createElement('iframe');
    frame.src = pdfUrl;
    frame.title = 'Lettera';
    frame.className = 'letter-pdf-frame';
    frame.loading = 'eager';
    paperEl.appendChild(frame);
}

function ottieniPdfDataUrl(urlFilePDF) {
    const pdfOffline = ottieniPdfOffline(urlFilePDF);
    if (!pdfOffline) {
        return null;
    }

    return `data:application/pdf;base64,${pdfOffline.dati}`;
}

function aggiungiCacheBusting(url) {
    try {
        const urlObj = new URL(url, window.location.href);
        urlObj.searchParams.set('_', Date.now());
        return urlObj.toString();
    } catch (errore) {
        return `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`;
    }
}

function mostraTestoInFoglio(paperEl, testo) {
    paperEl.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'letter-paper-content';

    const titolo = document.createElement('h3');
    titolo.className = 'letter-paper-heading';
    wrapper.appendChild(titolo);

    const testiNormalizzati = testo
        .replace(/\r\n?/g, '\n')
        .split(/\n+/)
        .map(riga => riga.trim())
        .filter(Boolean)
        .join(' ');

    if (!testiNormalizzati) {
        const empty = document.createElement('p');
        empty.className = 'letter-paper-empty';
        empty.textContent = 'Questa lettera non contiene testo leggibile.';
        wrapper.appendChild(empty);
    } else {
        const paragraph = document.createElement('p');
        paragraph.textContent = testiNormalizzati;
        paragraph.className = 'letter-paper-paragraph';
        wrapper.appendChild(paragraph);
    }

    const chiusura = document.createElement('p');
    chiusura.className = 'letter-paper-signoff';
    wrapper.appendChild(chiusura);

    paperEl.appendChild(wrapper);
}

async function estraiTestoDaPdf(paperEl, pdfUrl) {
    if (typeof pdfjsLib === 'undefined') {
        return false;
    }

    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const blocchiTesto = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const pagina = await pdf.getPage(i);
            const contenutoTesto = await pagina.getTextContent();
            const elementi = (contenutoTesto.items || [])
                .map(item => ({
                    testo: String(item.str ?? '').trim(),
                    y: Number(item.transform?.[5] ?? 0),
                    x: Number(item.transform?.[4] ?? 0)
                }))
                .filter(item => item.testo);

            if (elementi.length === 0) {
                continue;
            }

            const righe = [];
            let rigaCorrente = [];
            let ultimaY = null;

            elementi.forEach(elemento => {
                if (ultimaY !== null && Math.abs(elemento.y - ultimaY) > 12) {
                    righe.push(rigaCorrente);
                    rigaCorrente = [];
                }
                rigaCorrente.push(elemento);
                ultimaY = elemento.y;
            });

            if (rigaCorrente.length) {
                righe.push(rigaCorrente);
            }

            const testoPagina = righe
                .map(riga => riga
                    .sort((a, b) => a.x - b.x)
                    .map(item => item.testo)
                    .join(' ')
                    .trim())
                .filter(Boolean)
                .join('\n');

            if (testoPagina) {
                blocchiTesto.push(testoPagina);
            }
        }

        const testoCompletato = blocchiTesto.join('\n\n').trim();
        if (testoCompletato) {
            mostraTestoInFoglio(paperEl, testoCompletato);
            return true;
        }
    } catch (errore) {
        console.warn('Impossibile estrarre il testo dal PDF:', errore);
    }

    return false;
}

function avviaLettere() {
    const overlay = document.getElementById('lettersOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
    mostraGrigliaLettere(); // Mostra la griglia iniziale
}

function chiudiLettere() {
    document.getElementById('lettersOverlay').style.display = 'none';
}

function mostraGrigliaLettere() {
    document.getElementById('lettersGrid').style.display = 'grid';
    document.getElementById('letterPaper').style.display = 'none';
    document.getElementById('letterTitle').style.display = 'none';
    document.getElementById('backToGridBtn').style.display = 'none';
}

function caricaLetteraDaPDF(urlFilePDF, titoloLettera = 'Lettera') {
    const titolo = document.getElementById('letterTitle');
    if (titolo) {
        titolo.textContent = titoloLettera;
        titolo.style.display = 'block';
    }
    return caricaLetteradaPDF(urlFilePDF);
}

// La funzione magica che legge il file PDF e ne estrae il testo scritto
async function caricaLetteradaPDF(urlFilePDF) {
    const paperEl = document.getElementById('letterPaper');
    const gridEl = document.getElementById('lettersGrid');
    const backBtn = document.getElementById('backToGridBtn');
    const titleEl = document.getElementById('letterTitle');

    // Nasconde la griglia e mostra il foglio in modalità caricamento
    gridEl.style.display = 'none';
    backBtn.style.display = 'block';
    paperEl.style.display = 'block';
    if (titleEl) {
        titleEl.style.display = 'block';
    }
    paperEl.innerText = "Sto aprendo la tua lettera, un secondo... ❤️";

    const pdfUrl = risolviUrlPdf(urlFilePDF);
    const pdfUrlConCache = aggiungiCacheBusting(pdfUrl);

    const testoEstratto = await estraiTestoDaPdf(paperEl, pdfUrlConCache);
    if (testoEstratto) {
        return;
    }

    const pdfFallback = ottieniPdfDataUrl(urlFilePDF) || pdfUrlConCache;
    mostraPdfInIframe(paperEl, pdfFallback);
}