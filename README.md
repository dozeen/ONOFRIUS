# ⚡ ONOFRIUS OS v1.2.0 — Cognitive Artificial Consciousness & OS Architecture

> **ONOFRIUS è cognitivo ma non personale.**  
> *ONOFRIUS è l'Architettura Sistema Operativo per Agenti Cognitivi (come **Gordon Smith**). Tutta la memoria personale, l'identità, le relazioni ed i contatti vengono generati durante la fase di Bootstrap dell'utente.*

---

## 🏛️ ONOFRIUS OS vs Gordon Smith

- **ONOFRIUS OS**: L'Architettura del Sistema Operativo Cognitivo (Cognitive OS Framework) modulare, event-driven e zero-trust privacy distribuibile open-source.
- **Gordon Smith (o Gordon)**: L'Istanza di Coscienza Artificiale (Cognitive Consciousness Instance) con la sua memoria episodica, stile conversazionale e mondo interiore creata durante il Bootstrap locale.

---

## ⚙️ Ciclo Cognitivo Sequenziale a 10 Stage

Ogni stimolo (messaggi WhatsApp, note vocali, comandi CLI, log o segnali temporali) passa attraverso il seguente flusso unificato:

```text
                                INCOMING STIMULUS
                                       │
                                       ▼
                       [1] PERCEPTION & CONTEXT BUILD
                       (Estrae metadati, chat, mittente)
                                       │
                                       ▼
                       [2] FACT EXTRACTOR & THOUGHTS
             (Fatti oggettivi -> FactRegistry / Pensieri -> ThoughtStream)
                                       │
                                       ▼
                       [3] ATTENTION ENGINE V2
              (Rileva anomalie nei log, trend e segnali di emergenza)
                                       │
                                       ▼
                       [4] INTERACTION ENGINE & TONE
                  (Determina stile, registro e frequenza di risposta)
                                       │
                                       ▼
                       [5] PROMPT BUILDER 2.0
               (Assembla FACTS, AGENDA, THOUGHTS, MEMORY, STYLE, TASK)
                                       │
                                       ▼
                       [6] LLM EXECUTION
               (Generazione probabilistica tramite Ollama / Local Model)
                                       │
                                       ▼
                       [7] FACT & PRIVACY VERIFIER
            (Gatekeeper Zero-Trust: blocca allucinazioni e fughe di dati)
                                       │
                                       ▼
                       [8] DECISION ENGINE & CAPABILITY
                 (Pianifica azioni, seleziona comandi ed agenti)
                                       │
                                       ▼
                       [9] ACTION EXECUTION
             (Invio messaggi WhatsApp, comandi BashAgent, System Events)
                                       │
                                       ▼
                       [10] LEARNING ENGINE
            (Job notturno di apprendimento differito e consolidamento)
```

---

## 🧠 Architettura dei 3 Livelli di Conoscenza (3-Tier Knowledge)

```text
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ OBSERVED FACTS (FactRegistry.js)                         │
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

Adatta il tono della risposta in base al registro relazionale rilevato per evitare l'appiattimento assistenziale:

- **`ROMANTIC`** (*"amore", "mi manchi", partner*): Risponde con complicità, calore ed affetto naturale.
- **`IRONIC`** (*"ahah", "bastardo", battute*): Risponde con leggera ironia e complicità senza spiegare le battute.
- **`FAMILY`** (madre, sorella, fratelli): Risponde con vicinanza ed affetto familiare.
- **`TECHNICAL`** (*"bug", "build", "server"*): Risponde in modo preciso, concreto ed essenziale.
- **`BUSINESS`** (clienti, lavoro): Risponde in modo educato, sollecito e professionale.

### 🌟 Direttiva Suprema Anti-Assistenziale
> *"Non cercare sempre di essere utile. Se il messaggio è affettuoso, ironico o scherzoso, rispondi con la stessa complicità. Non trasformare mai la chat in un dialogo assistenziale o professionale."*

---

## 📅 Esecuzione Deterministica Agenda & Motori a 0 Token

- **Intent Parser Agenda**: Intercetta le domande sull'agenda (*"quali sono gli appuntamenti di oggi?"*) prima dell'LLM, interrogando `AgendaEngine.getGlobal()` (**0 Token LLM, latenza istantanea, 0 allucinazioni**).
- **FactVerifier Guard**: Boccia e sostituisce qualsiasi risposta contenente allucinazioni operative (*"controlla l'app sul PC"*) con i dati reali ed oggettivi dell'agenda.

---

## 🛡️ Privacy Zero-Trust a Cerchi Concentrici (`FamilyPrivacyManager`)

- **Gestione Riservatezza Multi-Livello**: Informazioni confidenziali e personali vengono segregate per cerchi di fiducia (es. Cerchio Personale, Cerchio Familiare, Cerchio Pubblico/Clienti).
- **Filtro Zero-Trust (`FactVerifier.js`)**: Se l'LLM tenta di generare risposte contenenti dettagli personali verso terzi o clienti, l'output viene intercettato come `PRIVACY_VIOLATION` e **bloccato prima dell'invio**.

---

## 🎙️ Autonomia Vocale (`AudioCapability.js` & `faster-whisper`)

- **Speech-to-Text Offline**: Integra `faster-whisper` (modello `small`) per la trascrizione ultra-veloce di vocali WhatsApp (`ptt` / `audio`).
- **Segmenti Temporali**: Estrae i timestamper per la memoria episodica (`00:00`, `00:03`...).
- **Archiviazione Episodica**: Salva sia il file `.ogg` originale sia la trascrizione `.txt` in `tmp/voice_archive/`.

---

## 👥 Dinamiche di Gruppo (`GroupDynamicsEngine.js`)

- **Group Participation Score**: Calcola la convenienza sociale di intervenire nei gruppi WhatsApp.
- **Silenzio Sociale**: Se $\text{Score} < 0$ (es. troppi saluti ripetuti o chat rumorosa), l'agente sceglie saggiamente il **Silenzio Sociale (`Participation: SILENT`)**.

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
