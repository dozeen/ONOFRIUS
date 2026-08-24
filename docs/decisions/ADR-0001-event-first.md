# ADR-0001: Event-First Architecture Pattern

- **Status**: Accettato
- **Data**: 2026-08-21
- **Versione**: v1.2.0 (Alpha 0.5)

---

## Contestazione e Problema
Negli agenti conversazionali tradizionali, il codice dell'adattatore (es. WhatsApp o Telegram) invia direttamente i messaggi al modello di linguaggio (LLM) o invoca classi di servizio in modo sincrono. Questo crea un forte accoppiamento, rende impossibile testare il motore cognitivo in isolamento e limita l'estensibilità a nuovi canali.

## Decisione
Adottare l'architettura **Event-First**. Tutti gli stimoli in ingresso, i comandi, i log ed le variazioni di stato devono essere convertiti in eventi ed emessi sul sistema centralizzato **EventBus**. 

## Conseguenze
- **Pro**: Disaccoppiamento totale. Il Brain e l'agente (Gordon Smith) non sanno da quale canale provenga lo stimolo.
- **Pro**: Possibilità di aggiungere nuovi adattatori (Discord, REST API, Voce) senza modificare una sola riga del Kernel.
- **Contro**: Maggiore complessità nel tracciamento del flusso asincrono (risolto tramite `CorrelationId` e log dell'EventBus).
