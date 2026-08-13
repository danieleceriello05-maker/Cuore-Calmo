# 🌸 Per Te, Sempre — Un rifugio nei momenti di ansia

> *Un'applicazione web creata con il cuore da un ragazzo per la propria ragazza, pensata per accompagnarla e aiutarla a ritrovare la calma nei momenti di ansia, panico e forte stress.*

---

## 💖 L'Idea dietro il Progetto

L'ansia e gli attacchi di panico possono far sentire smarriti e vulnerabili. Questo progetto nasce dal desiderio di offrire uno **spazio sicuro, intimo e rassicurante**, sempre a portata di mano sul proprio smartphone. 

L'interfaccia è stata curata con toni pastello rilassanti, forme morbide e un design minimalista per ridurre al minimo gli stimoli visivi e trasmettere un'immediata sensazione di calore e protezione.

---

## 🛠️ Funzionalità Principali

L'applicazione raccoglie una serie di strumenti pratici, guidati e multimediali pensati per le diverse fasi dell'ansia:

* **💬 Parla con me (Conversazione Guidata):** Un bot interattivo basato su risposte a scelta multipla. Guida passo passo la persona attraverso domande dolci e rassicuranti, offrendo grounding visivo e distrazione senza richiedere la fatica di digitare testo durante un momento di crisi.
* **🌬️ Respira (Tecnica 4 - 7 - 8):** Un esercizio di respirazione guidato visivamente da un cerchio che si espande e si rimpicciolisce a tempo. Segue la tecnica scientifica *4-7-8* (4s inspirazione, 7s trattenimento, 8s espirazione) con timer e indicazioni a schermo.
* **🌧️ Suoni per Rilassarti:** Una raccolta di traccie audio in *loop* (pioggia, rumore bianco, suoni della natura) pensate per isolare i rumori esterni e favorire il rilassamento.
* **✉️ Lettere per te:** Una sezione dedicata ai ricordi e all'affetto. L'app legge ed estrae in tempo reale il testo dai file `.pdf` inseriti nella cartella locale `lettere/`, mostrandoli con uno stile grafico che ricorda un foglio di carta.
* **📖 Il mio diario:** Uno spazio privato per sfogarsi e annotare i propri pensieri. I testi vengono salvati in automatico nella memoria locale del dispositivo (`localStorage`), garantendo privacy assoluta e salvataggio in tempo reale.

---

## 📱 Prestazioni & Offline-First

L'applicazione è sviluppata per funzionare **al 100% offline**:
* Nessun dato o testo del diario viene inviato a server esterni (totale privacy).
* Gli audio e la logica delle funzioni sono memorizzati sul dispositivo.
* Può essere salvata sulla schermata Home dell'iPhone o di qualsiasi smartphone Android come **PWA (Progressive Web App)**, comportandosi come un'app nativa a schermo intero.

---

## 💻 Tecnologie Utilizzate

* **HTML5:** Struttura semantica e accessibile dell'applicazione.
* **CSS3:** Design responsive con palette colori custom, animazioni fluide e interfacce a schede (cards).
* **JavaScript (Vanilla):** Gestione di timer, audio, navigazione ad albero logico e salvataggio locale.
* **[PDF.js](https://mozilla.github.org/pdf.js/):** Libreria per l'estrazione e il rendering del testo dai file PDF in locale.
    ├── 1.pdf
    ├── 2.pdf
    └── 3.pdf
