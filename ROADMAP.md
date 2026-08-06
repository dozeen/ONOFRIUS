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

---

## Alpha 0.3.1 — Auto Doctor & Self Healing ✅

**Obiettivo:** ONOFRIUS verifica sé stesso ad ogni avvio.

---

## Alpha 0.3.2 — Environment Awareness & Resilience ✅

**Obiettivo:** auto-rilevamento dell'ambiente e massima tolleranza ai difetti.

- ✅ Browser auto-detection ancora più robusta (Google Chrome, Chromium, Chrome Stable, Chrome Beta).
- ✅ OLLAMA_HOST con valore di default (http://localhost:11434) se manca.
- ✅ Su WSL degradare automaticamente gli errori DBus a messaggi di debug.
- ✅ Se viene rilevato WSL e manca ffmpeg, suggerire `sudo apt install ffmpeg`.
- ✅ Aggiunta sezione ENVIRONMENT nel report del Doctor.

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

---

## Alpha 0.6 — Knowledge Engine

---

## Alpha 0.7 — Planning Engine

---

## Alpha 0.8 — Multi Agent

---

## Alpha 0.9 — Cognitive Kernel

---

## Alpha 1.0 — ONOFRIUS First Stable

---

## Versione 2.0 — Distributed Cognition

---

## Visione Finale

L'obiettivo non è costruire un chatbot.

L'obiettivo è costruire un **Sistema Operativo Cognitivo**.
