# ONOFRIUS OS — AUTONOMY & AGENT EXECUTION ARCHITECTURE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Livelli di Autonomia dell'Agente

ONOFRIUS OS definisce tre livelli di autonomia operativa per l'agente **Gordon Smith**:

### Livello 1: Autonomia Conversazionale & Transizione per Maturità di Conoscenza
- **Fase A (Assorbimento & Silenzio Sociale)**: Quando ONOFRIUS entra in un nuovo contesto o gruppo, opera in modalità percezione passiva ed apprendimento silente (`Participation: SILENT`). Registra fatti, preferenze ed intenzioni senza generare rumore o risposte speculative ($Score < 0$).
- **Fase B (Transizione ad Intervento Certo)**: Quando l'indice di maturità della conoscenza acquisisce elementi di livello certo ($Confidence \ge 0.90$ / `CERTAINTY` o menzione esplicita), l'agente **abbandona il silenzio ed interviene in autonomia con risposte puntuali e certe**, garantendo zero allucinazioni.

### Livello 2: Autonomia di Apprendimento & Diagnostica
- L'agente analizza i log di sistema (`SystemObserver`), controlla il proprio stato di salute (`Doctor System`) ed esegue il consolidamento notturno della conoscenza (`LearningEngine`) alle 03:00 in totale autonomia.

### Livello 3: Autonomia Esecutiva Controllata (`BashAgent`)
- L'esecuzione di comandi sul sistema operativo (`systemctl`, `docker`, `sed`, `awk`, `grep`) è delegata a sub-agenti operativi come `BashAgent`.
- Nessun comando ad alto rischio può essere eseguito senza passare la validazione preventiva del `DecisionEngine`.
