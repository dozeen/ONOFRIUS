/**
 * ConversationContext
 * 
 * Rappresenta lo stato della conversazione corrente.
 * Contiene: messaggi, partecipanti, stato, riassunto, statistiche.
 * Viene mantenuto in memoria durante la conversazione.
 * Viene consolidato nel Night Brain.
 */

class ConversationContext {

    constructor(chatId, identity) {

        this.chatId = chatId;
        this.identity = identity;
        
        // Messaggi della conversazione corrente
        this.messages = [];
        
        // Partecipanti attivi nella conversazione
        this.participants = new Set();
        if (identity?.id) {
            this.participants.add(identity.id);
        }
        
        // Stato della conversazione
        this.state = {
            startTime: Date.now(),
            lastUpdate: Date.now(),
            messageCount: 0,
            isActive: true,
            topic: null,
            sentiment: 'neutral',
            urgency: 'normal'
        };
        
        // Contesto della conversazione
        this.context = {
            currentTopic: null,
            agenda: [],
            relatedEvents: [],
            decisions: [],
            actions: []
        };
        
        // Statistiche
        this.statistics = {
            totalMessages: 0,
            participantCount: 0,
            averageResponseTime: 0,
            sentimentHistory: [],
            topicHistory: []
        };
        
    }

    /**
     * Aggiunge un messaggio alla conversazione
     */
    addMessage(message) {

        this.messages.push({
            timestamp: Date.now(),
            actor: message.actor,
            text: message.text,
            sentiment: message.sentiment,
            classification: message.classification,
            intent: message.intent
        });

        if (message.actor) {
            this.participants.add(message.actor);
        }

        this.state.lastUpdate = Date.now();
        this.state.messageCount++;
        this.statistics.totalMessages++;

        return this;

    }

    /**
     * Aggiorna il topic della conversazione
     */
    setTopic(topic) {

        if (this.state.topic !== topic) {
            this.statistics.topicHistory.push({
                topic: this.state.topic,
                endTime: Date.now()
            });
        }

        this.state.topic = topic;
        this.context.currentTopic = topic;

        return this;

    }

    /**
     * Aggiorna il sentiment della conversazione
     */
    updateSentiment(sentiment) {

        this.state.sentiment = sentiment;
        this.statistics.sentimentHistory.push({
            sentiment: sentiment,
            timestamp: Date.now()
        });

        return this;

    }

    /**
     * Imposta l'urgenza della conversazione
     */
    setUrgency(urgency) {

        this.state.urgency = urgency;

        return this;

    }

    /**
     * Aggiunge una decisione presa durante la conversazione
     */
    addDecision(decision) {

        this.context.decisions.push({
            timestamp: Date.now(),
            decision: decision,
            actor: this.identity?.id
        });

        return this;

    }

    /**
     * Aggiunge un'azione da intraprendere
     */
    addAction(action) {

        this.context.actions.push({
            timestamp: Date.now(),
            action: action,
            status: 'pending'
        });

        return this;

    }

    /**
     * Ottiene i messaggi dell'ultimo N minuti
     */
    getRecentMessages(minutes = 5) {

        const cutoffTime = Date.now() - (minutes * 60 * 1000);

        return this.messages.filter(m => m.timestamp > cutoffTime);

    }

    /**
     * Ottiene il riassunto della conversazione
     */
    getSummary() {

        return {
            chatId: this.chatId,
            topic: this.state.topic,
            sentiment: this.state.sentiment,
            urgency: this.state.urgency,
            participantCount: this.participants.size,
            participants: Array.from(this.participants),
            messageCount: this.state.messageCount,
            duration: Date.now() - this.state.startTime,
            decisions: this.context.decisions,
            actions: this.context.actions,
            recentMessages: this.getRecentMessages(10)
        };

    }

    /**
     * Marca la conversazione come completata
     */
    close() {

        this.state.isActive = false;
        this.statistics.participantCount = this.participants.size;

        return this.getSummary();

    }

}

module.exports = ConversationContext;
