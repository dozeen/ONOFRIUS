# ONOFRIUS ROADMAP

## Alpha 0.2 — Runtime Stabilization ✅ (in corso)

**Obiettivo:** rendere ONOFRIUS installabile su qualsiasi macchina.

### Boot
- ✅ BootManager
- ✅ StartupChecks
- ✅ ServiceRegistry
- ✅ Health Report
- ✅ BrowserCheck
- ⏳ Doctor System
- ⏳ Health API

### WhatsApp
- ✅ QR automatico
- ✅ Login stabile
- ✅ Event Pipeline
- ⏳ Reconnection automatica

### Installazione
- ✅ Setup Wizard
- ⏳ npm run doctor
- ⏳ Messaggi di errore guidati

---

## Alpha 0.3 — Self Diagnostics ✅

**Obiettivo:** ONOFRIUS impara a controllare sé stesso.

### Doctor
`npm run doctor`

**Controlli:**
- Node
- npm
- Browser
- WhatsApp
- Ollama
- Plugins
- Memory
- Storage
- Permissions
- ffmpeg
- Git
- .env

### Auto Fix
`npm run doctor --fix`

---

## Alpha 0.3.1 — Auto Doctor & Self Healing ✅

**Obiettivo:** ONOFRIUS verifica sé stesso ad ogni avvio.

- ✅ Doctor eseguito automaticamente all'avvio (`npm start`).
- ✅ Ollama senza `.env` → WARN invece di ERROR.
- ✅ Browser con istruzioni di installazione specifiche per la distribuzione Linux.
- ✅ `doctor --fix` crea automaticamente un `.env` di esempio se manca.

---

## Alpha 0.4 — Bash Agent

Nasce il primo agente di sistema.

### BashAgent

**Capacità:**
- leggere log
- eseguire bash
- usare sed
- usare awk
- usare grep
- usare systemctl
- usare journalctl
- usare cron
- usare docker
- usare apt

*Ogni azione diventa un Event.*

---

## Alpha 0.5 — Cognitive Memory

Espansione della memoria.

---

## Alpha 0.6 — Knowledge Engine

Costruzione automatica della conoscenza.

---

## Alpha 0.7 — Planning Engine

ONOFRIUS pianifica.

---

## Alpha 0.8 — Multi Agent

Separazione delle responsabilità.

---

## Alpha 0.9 — Cognitive Kernel

Il Kernel diventa completamente Event Driven.

---

## Alpha 1.0 — ONOFRIUS First Stable

Prima release stabile.

---

## Versione 2.0 — Distributed Cognition

Più istanze di ONOFRIUS collaborano tra loro.

---

## Visione Finale

L'obiettivo non è costruire un chatbot.

L'obiettivo è costruire un **Sistema Operativo Cognitivo**.
