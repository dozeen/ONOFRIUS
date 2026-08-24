# ONOFRIUS OS — AUTONOMY & AGENT EXECUTION ARCHITECTURE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Livelli di Autonomia dell'Agente

ONOFRIUS OS definisce tre livelli di autonomia operativa per l'agente **Gordon Smith**:

### Livello 1: Autonomia Conversazionale & Silenzio Sociale
- L'agente risponde in autonomia nei messaggi diretti e nei gruppi WhatsApp, oppure sceglie il **Silenzio Sociale (`Participation: SILENT`)** se l'Indice di Convenienza Sociale emesso dal `GroupDynamicsEngine` risulta negativo ($Score < 0$).

### Livello 2: Autonomia di Apprendimento & Diagnostica
- L'agente analizza i log di sistema (`SystemObserver`), controlla il proprio stato di salute (`Doctor System`) ed esegue il consolidamento notturno della conoscenza (`LearningEngine`) alle 03:00 in totale autonomia.

### Livello 3: Autonomia Esecutiva Controllata (`BashAgent`)
- L'esecuzione di comandi sul sistema operativo (`systemctl`, `docker`, `sed`, `awk`, `grep`) è delegata a sub-agenti operativi come `BashAgent`.
- Nessun comando ad alto rischio può essere eseguito senza passare la validazione preventiva del `DecisionEngine`.
