/**
 * WorkingMemory
 * 
 * Memoria di lavoro cognitiva condivisa tra tutti gli handler.
 * Contiene il contesto arricchito, attenzione, awareness.
 * È il singolo stato di verità durante l'elaborazione di un evento.
 */

class WorkingMemory {

    constructor(event, identity) {

        // Evento corrente in elaborazione
        this.event = event;
        this.identity = identity;

        // Contesto cognitivo arricchito
        this.cognition = {
            perception: null,
            classification: null,
            reasoning: null,
            emotion: null,
            intent: null,
            urgency: null,
            confidence: 0
        };

        // Consapevolezza e attenzione
        this.attention = {
            focus: null,
            priorities: [],
            relevantEvents: [],
            relevantMemories: [],
            threats: [],
            opportunities: []
        };

        // Stato di consapevolezza
        this.awareness = {
            currentGoal: null,
            contextualState: {},
            recentContext: [],
            environmentalFactors: {},
            emotionalState: null
        };

        // Memoria immediata (ultimi N messaggi)
        this.immediateMemory = {
            recentMessages: [],
            recentDecisions: [],
            recentActions: []
        };

        // Contesto della conversazione attuale
        this.conversation = null;

        // Contesto dell'agenda
        this.agenda = {
            upcomingEvents: [],
            currentConstraints: [],
            availabilityWindows: [],
            conflicts: []
        };

        // Stato decisionale
        this.decision = {
            reasoning: [],
            options: [],
            selectedOption: null,
            confidence: 0
        };

        // Disponibilità delle capability
        this.capabilities = {
            available: [],
            activated: []
        };

        // Risposta in preparazione
        this.response = {
            type: null,
            content: null,
            recipient: null,
            priority: 'normal'
        };

        // Timestamp di creazione
        this.createdAt = Date.now();

    }

    /**
     * Arricchisce la memoria con percezione
     */
    enrichPerception(perception) {

        this.cognition.perception = perception;
        this.attention.focus = perception?.classification;

        return this;

    }

    /**
     * Arricchisce la memoria con classificazione
     */
    enrichClassification(classification) {

        this.cognition.classification = classification;
        this.cognition.intent = classification?.intent;
        this.cognition.urgency = classification?.urgency;
        this.cognition.emotion = classification?.emotion;

        return this;

    }

    /**
     * Arricchisce la memoria con ragionamento
     */
    enrichReasoning(reasoning) {

        this.cognition.reasoning = reasoning;
        this.decision.reasoning = reasoning?.steps || [];

        return this;

    }

    /**
     * Imposta il focus dell'attenzione
     */
    setAttentionFocus(focus, confidence = 0.8) {

        this.attention.focus = focus;
        this.cognition.confidence = confidence;

        return this;

    }

    /**
     * Aggiunge una priorità
     */
    addPriority(priority, weight = 1) {

        this.attention.priorities.push({
            priority,
            weight,
            timestamp: Date.now()
        });

        // Ordina per peso decrescente
        this.attention.priorities.sort((a, b) => b.weight - a.weight);

        return this;

    }

    /**
     * Aggiunge un evento rilevante
     */
    addRelevantEvent(event) {

        this.attention.relevantEvents.push({
            event,
            timestamp: Date.now(),
            relevance: 0.8
        });

        return this;

    }

    /**
     * Aggiunge una memoria rilevante
     */
    addRelevantMemory(memory) {

        this.attention.relevantMemories.push({
            memory,
            timestamp: Date.now(),
            relevance: 0.8
        });

        return this;

    }

    /**
     * Imposta il contesto della conversazione
     */
    setConversation(conversation) {

        this.conversation = conversation;
        this.immediateMemory.recentMessages = 
            conversation?.getRecentMessages(10) || [];

        return this;

    }

    /**
     * Imposta il contesto dell'agenda
     */
    setAgenda(agenda) {

        this.agenda.upcomingEvents = agenda?.upcomingEvents || [];
        this.agenda.currentConstraints = agenda?.constraints || [];
        this.agenda.availabilityWindows = agenda?.availabilityWindows || [];
        this.agenda.conflicts = agenda?.conflicts || [];

        return this;

    }

    /**
     * Aggiunge un'opzione decisionale
     */
    addOption(option, reasoning = '') {

        this.decision.options.push({
            option,
            reasoning,
            score: 0,
            timestamp: Date.now()
        });

        return this;

    }

    /**
     * Seleziona un'opzione
     */
    selectOption(option, confidence = 0.8) {

        this.decision.selectedOption = option;
        this.decision.confidence = confidence;

        return this;

    }

    /**
     * Registra una minaccia
     */
    addThreat(threat, severity = 'medium') {

        this.attention.threats.push({
            threat,
            severity,
            timestamp: Date.now()
        });

        return this;

    }

    /**
     * Registra un'opportunità
     */
    addOpportunity(opportunity, value = 'medium') {

        this.attention.opportunities.push({
            opportunity,
            value,
            timestamp: Date.now()
        });

        return this;

    }

    /**
     * Ottiene uno snapshot della memoria
     */
    getSnapshot() {

        return {
            event: this.event?.id,
            identity: this.identity?.id,
            cognition: this.cognition,
            attention: {
                focus: this.attention.focus,
                priorityCount: this.attention.priorities.length,
                threatCount: this.attention.threats.length,
                opportunityCount: this.attention.opportunities.length
            },
            conversation: this.conversation?.chatId,
            agenda: {
                upcomingEventCount: this.agenda.upcomingEvents.length,
                conflictCount: this.agenda.conflicts.length
            },
            decision: {
                optionCount: this.decision.options.length,
                selectedOption: this.decision.selectedOption
            },
            response: this.response.type,
            createdAt: this.createdAt,
            duration: Date.now() - this.createdAt
        };

    }

    /**
     * Esporta lo stato completo della memoria
     */
    export() {

        return {
            event: this.event,
            identity: this.identity,
            cognition: this.cognition,
            attention: this.attention,
            awareness: this.awareness,
            immediateMemory: this.immediateMemory,
            conversation: this.conversation?.getSummary?.(),
            agenda: this.agenda,
            decision: this.decision,
            capabilities: this.capabilities,
            response: this.response,
            createdAt: this.createdAt
        };

    }

}

module.exports = WorkingMemory;
