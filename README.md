# ⚡ ONOFRIUS OS v1.1.0 — Cognitive Artificial Consciousness & OS Architecture

> **ONOFRIUS è cognitivo ma non personale.**
> *ONOFRIUS è l'Architettura Sistema Operativo per Agenti Cognitivi. Tutta la memoria personale, l'identità, le relazioni ed i contatti vengono generati durante la fase di Bootstrap dell'utente.*

---

## 🏛️ Architettura dei 3 Livelli di Conoscenza (3-Tier Knowledge)

```text
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ OBSERVED FACTS (ObservedFacts.js)                         │
│ Fatti oggettivi osservati e registrati (Zero inferenze)     │
├─────────────────────────────────────────────────────────────┤
│ 2️⃣ INFERRED CONTEXT (InferredContext.js)                    │
│ Ipotesi ed inferenze (emergent_hypothesis + evidenze)       │
├─────────────────────────────────────────────────────────────┤
│ 3️⃣ AMBIENT MEMORY (AmbientMemory.js)                        │
│ Narrazioni sociali sostenute con decadimento (0.99/giorno)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎭 Motore del Registro Relazionale (`ToneEngine.js`)

Adatta il tono della risposta in base al registro relazionale rilevato per evitare l'appiattimento assistenziale o professionale:

- **`ROMANTIC`** (*"amore", "mi manchi", partner*): Risponde con complicità, calore ed affetto naturale.
- **`IRONIC`** (*"ahah", "bastardo", battute*): Risponde con leggera ironia e complicità senza spiegare le battute.
- **`FAMILY`** (madre, sorella, fratelli): Risponde con vicinanza ed affetto familiare.
- **`TECHNICAL`** (*"bug", "build", "server"*): Risponde in modo preciso, concreto ed essenziale.
- **`BUSINESS`** (clienti, lavoro): Risponde in modo educato, sollecito e professionale.

### 🌟 Direttiva Suprema Anti-Assistenziale
> *"Non cercare sempre di essere utile. Se il messaggio è affettuoso, ironico o scherzoso, rispondi con la stessa complicità. Non trasformare mai la chat in un dialogo assistenziale o professionale."*

---

## 🎙️ Autonomia Vocale (`AudioCapability.js` & `faster-whisper`)

- **Speech-to-Text Offline**: Integra `faster-whisper` (modello `small`) per la trascrizione ultra-veloce di vocali WhatsApp (`ptt` / `audio`).
- **Segmenti Temporali**: Estrae i timestamper per la memoria episodica (`00:00`, `00:03`...).
- **Archiviazione Episodica**: Salva sia il file `.ogg` originale sia la trascrizione `.txt` in `tmp/voice_archive/`.

---

## 📅 Esecuzione Deterministica Agenda & Anti-Allucinazione

- **Intent Parser Agenda**: Intercetta le domande sull'agenda (*"quali sono gli appuntamenti di oggi?"*) prima dell'LLM, interrogando `AgendaEngine.getGlobal()` (**0 Token LLM, latenza istantanea, 0 allucinazioni**).
- **FactVerifier Guard**: Boccia e sostituisce qualsiasi risposta contenente allucinazioni operative (*"controlla l'app sul PC"*) con i dati reali ed oggettivi dell'agenda.

---

## 👥 Dinamiche di Gruppo (`GroupDynamicsEngine.js`)

- **Group Participation Score**: Calcola la convenienza sociale di intervenire nei gruppi WhatsApp.
- **Silenzio Sociale**: Se $\text{Score} < 0$ (es. troppi saluti ripetuti o chat rumorosa), Gordon sceglie saggiamente il **Silenzio Sociale (`Participation: SILENT`)**.

---

## 🛡️ Audit e Principio 9 (Cognitivo ma non Personale)

Ogni release viene sottoposta all'audit automatico `node forge/buildCore.js` che garantisce la totale assenza di dati personali, contatti o cronologie private nel pacchetto distribuito su GitHub.

---

### 💻 Installazione & Avvio

```bash
git clone git@github.com:dozeen/ONOFRIUS.git
cd ONOFRIUS
npm install
npm start
```
