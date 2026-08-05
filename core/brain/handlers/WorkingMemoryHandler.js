const WorkingMemory = require('../../memory/WorkingMemory');

/**
 * WorkingMemoryHandler
 * 
 * Mantiene e gestisce la memoria di lavoro cognitiva.
 * È il centro di coordinamento per tutti gli handler.
 * Tutti gli arricchimenti del contesto passano dalla WorkingMemory.
 */

class WorkingMemoryHandler {

    constructor() {

        this.workingMemory = null;
        this.previousMemory = null;

        this.config = {
            enableTracking: true,
            enableLogging: true
        };

    }

    /**
     * Inizializza una nuova WorkingMemory per l'evento
     */
    async process(context) {

        // Crea una nuova WorkingMemory per questo evento
        const workingMemory = new WorkingMemory(
            context.event,
            context.identity
        );

        // Arricchisci con percezione se disponibile
        if (context.perception) {
            workingMemory.enrichPerception(context.perception);
        }

        // Arricchisci con classificazione se disponibile
        if (context.classification) {
            workingMemory.enrichClassification(context.classification);
        }

        // Arricchisci con conversazione se disponibile
        if (context.conversation) {
            workingMemory.setConversation(context.conversation);
        }

        // Arricchisci con agenda se disponibile
        if (context.agenda) {
            workingMemory.setAgenda(context.agenda);
        }

        // Conserva la memoria precedente per confronto
        this.previousMemory = this.workingMemory;
        this.workingMemory = workingMemory;

        // Aggiungi la memoria al contesto
        context.workingMemory = workingMemory;

        if (this.config.enableLogging) {
            this.logMemorySnapshot();
        }

        return context;

    }

    /**
     * Aggiorna lo stato cognitivo
     */
    updateCognition(perception, classification, reasoning) {

        if (!this.workingMemory) return;

        if (perception) {
            this.workingMemory.enrichPerception(perception);
        }

        if (classification) {
            this.workingMemory.enrichClassification(classification);
        }

        if (reasoning) {
            this.workingMemory.enrichReasoning(reasoning);
        }

    }

    /**
     * Imposta il focus dell'attenzione
     */
    setAttentionFocus(focus, confidence) {

        if (this.workingMemory) {
            this.workingMemory.setAttentionFocus(focus, confidence);
        }

    }

    /**
     * Aggiunge una minaccia
     */
    addThreat(threat, severity) {

        if (this.workingMemory) {
            this.workingMemory.addThreat(threat, severity);
        }

    }

    /**
     * Aggiunge un'opportunità
     */
    addOpportunity(opportunity, value) {

        if (this.workingMemory) {
            this.workingMemory.addOpportunity(opportunity, value);
        }

    }

    /**
     * Aggiunge una priorità
     */
    addPriority(priority, weight) {

        if (this.workingMemory) {
            this.workingMemory.addPriority(priority, weight);
        }

    }

    /**
     * Imposta il tipo di risposta
     */
    setResponseType(type) {

        if (this.workingMemory) {
            this.workingMemory.response.type = type;
        }

    }

    /**
     * Prepara una risposta
     */
    prepareResponse(content, recipient, priority = 'normal') {

        if (this.workingMemory) {
            this.workingMemory.response = {
                type: 'prepared',
                content,
                recipient,
                priority
            };
        }

    }

    /**
     * Ottiene lo snapshot corrente della memoria
     */
    getSnapshot() {

        if (!this.workingMemory) return null;
        return this.workingMemory.getSnapshot();

    }

    /**
     * Ottiene l'esportazione completa della memoria
     */
    export() {

        if (!this.workingMemory) return null;
        return this.workingMemory.export();

    }

    /**
     * Confronta con la memoria precedente
     */
    compareWithPrevious() {

        if (!this.previousMemory || !this.workingMemory) {
            return { changes: [] };
        }

        const changes = [];

        // Controlla cambiamenti nella cognizione
        if (JSON.stringify(this.workingMemory.cognition) !== 
            JSON.stringify(this.previousMemory.cognition)) {
            changes.push('cognition');
        }

        // Controlla cambiamenti nell'attenzione
        if (this.workingMemory.attention.focus !== this.previousMemory.attention.focus) {
            changes.push('attention');
        }

        // Controlla cambiamenti nella decisione
        if (this.workingMemory.decision.selectedOption !== this.previousMemory.decision.selectedOption) {
            changes.push('decision');
        }

        return { changes };

    }

    /**
     * Log dello snapshot della memoria
     */
    logMemorySnapshot() {

        if (!this.workingMemory) return;

        const snapshot = this.getSnapshot();

        console.log(`[WorkingMemory] Event: ${snapshot.event}, Cognition: ${snapshot.cognition.confidence.toFixed(2)}, Focus: ${snapshot.attention.focus}`);

    }

    /**
     * Statistiche
     */
    getStats() {

        return {
            hasActiveMemory: !!this.workingMemory,
            hasPreviousMemory: !!this.previousMemory,
            currentSnapshot: this.getSnapshot(),
            memoryAge: this.workingMemory ? Date.now() - this.workingMemory.createdAt : 0
        };

    }

}

module.exports = WorkingMemoryHandler;
