# ONOFRIUS OS — CONNECTORS & ADAPTERS ARCHITECTURE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Modello degli Adattatori (Adapters Layer)

Il Core Cognitivo di ONOFRIUS OS è completamente agnostico dal canale di comunicazione di provenienza.

Gli **Adattatori (Connectors)** traducono i protocolli di rete ed i formati proprietari in `StimulusEvent` standardizzati emessi sull'EventBus.

---

## 2. Adattatori Supportati

### 2.1 WhatsApp Adapter (`adapters/whatsapp/`)
- Gestisce la connessione via `whatsapp-web.js`.
- Converte i messaggi di testo, media, citazioni e messaggi vocali in `Stimulus`.
- Gestisce la risposta asincrona via `message.reply`.

### 2.2 Audio & Voice Adapter (`AudioCapability.js`)
- Converte i file audio WhatsApp (`ptt` / `audio`) in formato `.ogg`.
- Esegue la trascrizione vocale in locale con `faster-whisper` (modello `small`).
- Estrae timestamp ed archivia il testo in `tmp/voice_archive/`.

### 2.3 CLI & Console Adapter (`cli/`)
- Permette di interagire con il Kernel Cognitivo via riga di comando per test e manutenzione.

### 2.4 REST & System Observer Adapter (`core/observers/`)
- Intercetta i log di sistema (`syslog`, `journalctl`, `docker`) ed il traffico HTTP per esporre la diagnostica al Kernel.
