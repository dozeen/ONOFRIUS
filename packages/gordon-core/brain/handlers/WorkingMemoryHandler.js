const WorkingMemory = require("../../memory/WorkingMemory");

/**
 * WorkingMemoryHandler
 * 
 * Mantiene e gestisce la memoria di lavoro cognitiva.
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

    async process(context) {
        const workingMemory = new WorkingMemory(
            context.event,
            context.identity
        );

        if (context.perception) workingMemory.enrichPerception(context.perception);
        if (context.classification) workingMemory.enrichClassification(context.classification);
        if (context.conversation) workingMemory.setConversation(context.conversation);
        if (context.agenda) workingMemory.setAgenda(context.agenda);

        this.previousMemory = this.workingMemory;
        this.workingMemory = workingMemory;
        context.workingMemory = workingMemory;

        if (this.config.enableLogging) {
            this.logMemorySnapshot();
        }

        return context;
    }

    updateCognition(perception, classification, reasoning) {
        if (!this.workingMemory) return;
        if (perception) this.workingMemory.enrichPerception(perception);
        if (classification) this.workingMemory.enrichClassification(classification);
        if (reasoning) this.workingMemory.enrichReasoning(reasoning);
    }

    setAttentionFocus(focus, confidence) {
        if (this.workingMemory) this.workingMemory.setAttentionFocus(focus, confidence);
    }

    addThreat(threat, severity) {
        if (this.workingMemory) this.workingMemory.addThreat(threat, severity);
    }

    addOpportunity(opportunity, value) {
        if (this.workingMemory) this.workingMemory.addOpportunity(opportunity, value);
    }

    addPriority(priority, weight) {
        if (this.workingMemory) this.workingMemory.addPriority(priority, weight);
    }

    setResponseType(type) {
        if (this.workingMemory) this.workingMemory.response.type = type;
    }

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

    getSnapshot() {
        if (!this.workingMemory) return null;
        return this.workingMemory.getSnapshot();
    }

    export() {
        if (!this.workingMemory) return null;
        return this.workingMemory.export();
    }

    logMemorySnapshot() {
        if (!this.workingMemory) return;
        const snapshot = this.getSnapshot();
        console.log(`[WorkingMemory] Event: ${snapshot.event}, Cognition: ${snapshot.cognition.confidence.toFixed(2)}, Focus: ${snapshot.attention.focus}`);
    }
}

module.exports = WorkingMemoryHandler;
