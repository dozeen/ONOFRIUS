# ONOFRIUS OS — CAPABILITY REGISTRY ARCHITECTURE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Registro delle Capacità (Capabilities)

In ONOFRIUS OS ogni azione operativa o interazione esterna è incapsulata in una **Capability** registrata nel `ServiceRegistry`.

Le Capability si dividono in due categorie principali:

### 1.1 Communication Capabilities
- **`WhatsAppCapability`**: Invio messaggi, risposte a citazione (`reply`), gestione gruppi, silenziamento ed invio audio.
- **`AudioCapability`**: Trascrizione audio locale offline con `faster-whisper` e salvataggio metadati episodici.

### 1.2 Operational & System Capabilities
- **`AgendaCapability`**: Interrogazione deterministica dell'agenda locale a 0 Token LLM (`AgendaEngine.getGlobal()`).
- **`BashCapability`**: Esecuzione sicura di comandi di sistema (`systemctl`, `docker`, `sed`, `awk`, `grep`) tramite l'agente `BashAgent`.

---

## 2. Regola di Esecuzione Sicura

Nessuna Capability può eseguire comandi ad alto impatto senza l'autorizzazione preventiva del `DecisionEngine` e la pubblicazione di un `SystemEvent` per l'audit di sistema.
