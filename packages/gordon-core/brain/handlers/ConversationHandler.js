const ConversationContext = require('../../conversation/ConversationContext');

/**
 * ConversationHandler
 * 
 * Gestisce il contesto della conversazione corrente.
 * Mantiene lo storico dei messaggi, partecipanti, stato.
 * Alimenta la WorkingMemory con i dati della conversazione.
 */

class ConversationHandler {

    constructor() {

        // Mappa di conversazioni attive: chatId -> ConversationContext
        this.activeConversations = new Map();

        // Configurazione
        this.config = {
            maxActiveConversations: 100,
            conversationTimeout: 30 * 60 * 1000, // 30 minuti
            messageHistoryLimit: 100
        };

    }

    /**
     * Processa l'evento e mantiene il contesto della conversazione
     */
    async process(context) {

        const chatId = context.chatId;
        const identity = context.identity;

        // Recupera o crea il contesto della conversazione
        let conversationContext = this.activeConversations.get(chatId);

        if (!conversationContext) {
            conversationContext = new ConversationContext(chatId, identity);
            this.activeConversations.set(chatId, conversationContext);
        }

        // Aggiorna il contesto della conversazione
        conversationContext.addMessage({
            actor: context.event?.actor || identity?.id,
            text: context.event?.text || '',
            sentiment: context.perception?.sentiment,
            classification: context.classification?.type,
            intent: context.classification?.intent
        });

        // Aggiorna topic se disponibile
        if (context.classification?.topic) {
            conversationContext.setTopic(context.classification.topic);
        }

        // Aggiorna sentiment
        if (context.perception?.sentiment) {
            conversationContext.updateSentiment(context.perception.sentiment);
        }

        // Aggiorna urgenza
        if (context.classification?.urgency) {
            conversationContext.setUrgency(context.classification.urgency);
        }

        // Aggiungi al contesto
        context.conversation = conversationContext;
        context.conversationSummary = conversationContext.getSummary();

        return context;

    }

    /**
     * Chiude una conversazione
     */
    closeConversation(chatId) {

        const conversation = this.activeConversations.get(chatId);

        if (conversation) {
            const summary = conversation.close();
            this.activeConversations.delete(chatId);
            return summary;
        }

        return null;

    }

    /**
     * Ottiene una conversazione attiva
     */
    getConversation(chatId) {

        return this.activeConversations.get(chatId);

    }

    /**
     * Ripulisce le conversazioni scadute
     */
    cleanupExpiredConversations() {

        const now = Date.now();
        const timeout = this.config.conversationTimeout;

        for (const [chatId, conversation] of this.activeConversations.entries()) {

            if (now - conversation.state.lastUpdate > timeout) {
                this.activeConversations.delete(chatId);
            }

        }

    }

    /**
     * Statistiche del gestore
     */
    getStats() {

        return {
            activeConversations: this.activeConversations.size,
            maxActive: this.config.maxActiveConversations,
            conversations: Array.from(this.activeConversations.entries()).map(([chatId, ctx]) => ({
                chatId,
                messageCount: ctx.state.messageCount,
                participantCount: ctx.participants.size,
                topic: ctx.state.topic,
                sentiment: ctx.state.sentiment
            }))
        };

    }

}

module.exports = ConversationHandler;
