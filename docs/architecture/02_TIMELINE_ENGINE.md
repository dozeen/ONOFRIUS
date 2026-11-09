# ONOFRIUS OS — TIMELINE & EPISODIC MEMORY ENGINE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Panoramica del Timeline Engine

Il **TimelineEngine** gestisce la memoria episodica e temporale dell'agente **Gordon Smith**. Ogni evento e stimolo viene ancorato ad una coordinata temporale immutabile (`Timestamp UTC` e segmento relativo).

---

## 2. Struttura della Memoria Episodica

La memoria episodica viene organizzata in 3 dimensioni:

1. **Short-Term Timeline (Finestra Conversazionale)**:
   - Mantiene gli ultimi N messaggi della chat attiva per preservare la continuità del dialogo.
2. **Episodic Voice Archive (`tmp/voice_archive/`)**:
   - Integra `faster-whisper` per la trascrizione automatica di note vocali (`ptt` / `audio`).
   - Associa ogni nota vocale `.ogg` alla trascrizione `.txt` suddivisa in segmenti temporali (`00:00`, `00:03`...).
3. **Historical Event Stream**:
   - Registro permanente degli avvenimenti, notifiche ed azioni svolte dal sistema nel tempo.

---

## 3. Decadimento Temporale e Ambient Memory

La conoscenza ambientale (`AmbientMemory.js`) applica una funzione di decadimento temporale:
$$\text{Weight}(t) = \text{InitialWeight} \times (0.99)^{\Delta t \text{ (giorni)}}$$

I fatti ed i ricordi con peso inferiore a una soglia critica vengono archiviati senza contaminare la memoria di lavoro attiva dell'LLM.
