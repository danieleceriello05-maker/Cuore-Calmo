// La struttura del dialogo: domande, risposte e bivi logici
const alberoDialogo = {
    inizio: {
        testo: "Hey pucci pu, sono qui. Fai un bel respiro profondo insieme a me... Come ti senti in questo momento?",
        opzioni: [
            { testo: "Ho molta paura, sento che mi sta venendo un attacco di panico", prossimoStep: "paura" },
            { testo: "Mi sento confusa, mi gira la testa, sento l'ansia che sale", prossimoStep: "confusa" },
            { testo: "Sento un peso sul petto", prossimoStep: "peso" }
        ]
    },
    paura: {
        testo: "Lo so, è una sensazione bruttissima, ma ricordati che sei al sicuro. Ci sono io con te, supereremo tutto questo insieme, andrà meglio te lo prometto. Vuoi che proviamo a distrarci un attimo oppure proviamo a respirare con calma?",
        opzioni: [
            { testo: "Aiutami a distrarmi", prossimoStep: "distrazione" },
            { testo: "Respiriamo con calma", prossimoStep: "vaiARespiro" }
        ]
    },
    confusa: {
        testo: "Hey amore tranquilla, ci sono io con te, passerà tutto. Stringi forte la collana che ti ho regalato, pensa a me che ti tengo per mano e ti dico: amore, andrà tutto bene, stai vincendo tu e sono orgoglioso di te, ora chiudi gli occhi, fai un respiro profondo e continua da dove ti sei fermata, io sono sempre qui accanto a te a dirti che sei fortissima e a fare il tifo per te. Mi senti accanto a te? Va un pochino meglio adesso?", 
        opzioni: [
            { testo: "Sì, ti sento accanto a me, mi sento un pochino meglio", prossimoStep: "miglioramento" },
            { testo: "Non ci riesco ancora", prossimoStep: "paura" }
        ]
    },
    peso: {
        testo: "Quel peso è solo l'ansia che ti blocca e ti stringe il petto, non ti farà del male, promesso, ti difendo io. Amore con calma, andrà tutto bene. Facciamo un gioco: mi elenchi 3 cose blu che vedi nella stanza?",
        opzioni: [
            { testo: "Fatto, le ho trovate", prossimoStep: "giocoFatto" },
            { testo: "Faccio fatica a concentrarmi, mi aiuti a respirare con calma?", prossimoStep: "vaiARespiro" }
        ]
    },
    distrazione: {
        testo: "Va bene cucciola mia! Allora facciamo così: Chiudi gli occhi per un secondo e pensa al tempo insieme, al tuo nostro momento preferito. Ti ricordi le risate, gli abbracci, i baci e le chiacchierate? Io sono sempre qui e ti stringo la mano forte forte. Va un po' meglio?",
        opzioni: [
            { testo: "Sì, va meglio", prossimoStep: "fine" },
            { testo: "Ho ancora bisogno di tempo", prossimoStep: "inizio" }
        ]
    },
    giocoFatto: {
        testo: "Bravissima amoreeee! Hai visto? Sei riuscita a concentrarti nonostante tutto. Questo significa che hai il controllo tu, non l'ansia. Un passo alla volta. Rimango qui con te finché non sei del tutto tranquilla (Anche se in realtà io sono sempre qui accanto a te).",
        opzioni: [
            { testo: "Grazie, restiamo ancora un po' così", prossimoStep: "fine" }
        ]
    },
    miglioramento: {
        testo: "Sei fortissima, amore. Stai facendo un ottimo lavoro. Sono orgoglioso di te! Ricordati che ti amo immensamente e che sono sempre accanto a te, questa brutta sensazione passerà prestissimo, promesso.",
        opzioni: [
            { testo: "Ti amo tantissimo anche io, grazie amore mio", prossimoStep: "fine" }
        ]
    },
    fine: {
        testo: "Io non vado da nessuna parte, sono sempre qui con te. Quando ti senti pronta puoi uscire dalla chat, altrimenti clicca qui sotto per ricominciare da capo se ne hai bisogno.",
        opzioni: [
            { testo: "Ricomincia dall'inizio", prossimoStep: "inizio" }
        ]
    }
};

function avviaChat() {
    document.getElementById('chatOverlay').style.display = 'flex';
    document.getElementById('chatMessages').innerHTML = ''; // Pulisce i vecchi messaggi
    mostraStepDialogo('inizio');
}

function chiudiChat() {
    document.getElementById('chatOverlay').style.display = 'none';
}

function mostraStepDialogo(idStep) {
    // Gestione speciale se rimanda alla respirazione
    if (idStep === 'vaiARespiro') {
        chiudiChat();
        avviaRespiro();
        return;
    }

    const boxMessaggi = document.getElementById('chatMessages');
    const boxOpzioni = document.getElementById('chatOptions');

    if (idStep === 'inizio') {
        boxMessaggi.innerHTML = '';
        boxOpzioni.innerHTML = '';
    }
    
    const step = alberoDialogo[idStep];
    
    // Svuota le vecchie opzioni durante la transizione
    boxOpzioni.innerHTML = '';

    // Crea la nuvoletta del "bot" (tu) con avatar accanto
    const rowBot = document.createElement('div');
    rowBot.className = 'chat-message-row bot';

    const avatarBot = document.createElement('div');
    avatarBot.className = 'chat-avatar';
    avatarBot.innerHTML = '<img src="img/img-profile.png" alt="Avatar del bot">';
    rowBot.appendChild(avatarBot);

    const msgBot = document.createElement('div');
    msgBot.className = 'msg bot';
    msgBot.innerText = step.testo;
    rowBot.appendChild(msgBot);

    boxMessaggi.appendChild(rowBot);

    // Scorri la chat automaticamente verso il basso
    boxMessaggi.scrollTop = boxMessaggi.scrollHeight;

    // Genera i nuovi pulsanti per la risposta della ragazza
    step.opzioni.forEach(opzione => {
        const bottone = document.createElement('div');
        bottone.className = 'opt-btn';
        bottone.innerText = opzione.testo;
        
        // Al click dell'opzione...
        bottone.onclick = () => {
            // Mostra visivamente la sua risposta nella chat
            const rowUtente = document.createElement('div');
            rowUtente.className = 'chat-message-row user';

            const msgUtente = document.createElement('div');
            msgUtente.className = 'msg user';
            msgUtente.innerText = opzione.testo;
            rowUtente.appendChild(msgUtente);

            boxMessaggi.appendChild(rowUtente);
            
            // Ritarda leggermente la risposta successiva per renderla più naturale
            setTimeout(() => {
                mostraStepDialogo(opzione.prossimoStep);
            }, 600);
        };
        
        boxOpzioni.appendChild(bottone);
    });
}