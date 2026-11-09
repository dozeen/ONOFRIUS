# ONOFRIUS OS — EVENT MODEL ARCHITECTURE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Principio Fondamentale: Event-First

In ONOFRIUS OS ogni interazione, stimolo o cambiamento di stato interno nasce e si propaga come un **Evento**.

Nessun modulo agisce in modo sincrono o con accoppiamento diretto verso altri moduli: l'**EventBus** è il sistema circolatorio del Kernel Cognitivo.

---

## 2. Tipologie di Eventi

### 2.1 StimulusEvent
Rappresenta uno stimolo grezzo proveniente dal mondo esterno (es. messaggio WhatsApp ricevuto, nota vocale caricata, comando CLI digitato, webhook HTTP).
- **Payload**: `sender`, `chatId`, `rawContent`, `mediaType`, `timestamp`.

### 2.2 FactEvent
Rappresenta un fatto oggettivo estratto dal `FactExtractor`.
- **Payload**: `entityType`, `extractedValue`, `sourceContext`, `confidence`.

### 2.3 SystemEvent
Rappresenta un cambiamento di stato operativo del sistema operativo o dell'agente (es. `SERVICE_STARTED`, `BASH_COMMAND_EXECUTED`, `DOCTOR_CHECK_PASSED`).
- **Payload**: `component`, `action`, `status`, `details`.

### 2.4 SocialEvent
Rappresenta un segnale sociale o relazionale emesso dall' `InteractionEngine` o dal `GroupDynamicsEngine` (es. `SILENT_MODE_ACTIVATED`, `TONE_MATCHED`).
- **Payload**: `chatId`, `tone`, `score`, `participation`.

### 2.5 AttentionAlertEvent
Rappresenta un alert prioritario generato dall' `AttentionEngine v2` a seguito della rilevazione di anomalie nei log o picchi di emergenza.
- **Payload**: `priorityScore` (0-100), `reason`, `source`.

---

## 3. Flusso di Propagazione sul Bus

```text
ADAPTER ──► StimulusEvent ──► EVENT BUS ──► Perception
                                            │
SYSTEM  ──► SystemEvent   ──► EVENT BUS ──► Attention Engine
                                            │
ACTION  ──► FactEvent     ──► EVENT BUS ──► FactRegistry
```
