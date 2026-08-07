/**
 * ContextEnrichment
 * 
 * Arricchisce la WorkingMemory con contesto esterno:
 * - Conversazioni precedenti
 * - Relazioni con i partecipanti
 * - Knowledge rilevante
 * - Eventi storici rilevanti
 * - Pattern comportamentali
 */

class ContextEnrichment {

    constructor() {

        this.config = {
            maxHistoryMessages: 20,
            maxRelatedEvents: 10,
            maxKnowledgeItems: 5,
            relevanceThreshold: 0.5
        };

    }

    /**
     * Processa e arricchisce il contesto
     */
    async process(context) {

        if (!context.workingMemory) {
            return context;
        }

        const workingMemory = context.workingMemory;

        // 1. Arricchisci con history della conversazione
        if (context.conversation) {
            this.enrichWithConversationHistory(workingMemory, context.conversation);
        }

        // 2. Arricchisci con relazioni
        if (context.identity) {
            await this.enrichWithRelationships(workingMemory, context.identity, context);
        }

        // 3. Arricchisci con knowledge
        if (context.memory) {
            await this.enrichWithKnowledge(workingMemory, context.identity, context);
        }

        // 4. Arricchisci con pattern storici
        if (context.history) {
            await this.enrichWithHistoricalPatterns(workingMemory, context.identity, context);
        }

        // 5. Arricchisci con Eventi correlati
        await this.enrichWithRelatedEvents(workingMemory, context);

        // 6. Arricchisci con contesto emotivo storico
        if (context.identity) {
            await this.enrichWithEmotionalContext(workingMemory, context.identity, context);
        }

        // 7. Arricchisci con vincoli e opportunità
        await this.enrichWithConstraintsAndOpportunities(workingMemory, context);

        context.contextEnrichment = {
            enrichedAt: Date.now(),
            sources: [
                'conversationHistory',
                'relationships',
                'knowledge',
                'historicalPatterns',
                'relatedEvents',
                'emotionalContext',
                'constraintsAndOpportunities'
            ]
        };

        return context;

    }

    /**
     * Arricchisci con storia della conversazione
     */
    enrichWithConversationHistory(workingMemory, conversation) {

        if (!conversation) return;

        // Aggiungi messaggi recenti estesi
        const recentMessages = conversation.getRecentMessages(30); // Ultimi 30 minuti
        workingMemory.immediateMemory.recentMessages = recentMessages;

        // Aggiungi topic history
        if (conversation.statistics.topicHistory.length > 0) {
            workingMemory.attention.relevantEvents.push({
                type: 'topic_history',
                data: conversation.statistics.topicHistory.slice(-5),
                timestamp: Date.now(),
                relevance: 0.7
            });
        }

        // Aggiungi sentiment history
        if (conversation.statistics.sentimentHistory.length > 0) {
            workingMemory.awareness.emotionalState = {
                current: conversation.state.sentiment,
                history: conversation.statistics.sentimentHistory.slice(-10),
                trend: this.calculateSentimentTrend(conversation.statistics.sentimentHistory)
            };
        }

        // Aggiungi decisioni prese
        workingMemory.immediateMemory.recentDecisions = conversation.context.decisions;

        // Aggiungi azioni pendenti
        workingMemory.immediateMemory.recentActions = conversation.context.actions;

    }

    /**
     * Calcola il trend del sentiment
     */
    calculateSentimentTrend(history) {

        if (history.length < 2) return 'stable';

        const recent = history.slice(-5);
        const sentimentValues = {
            'very_negative': -2,
            'negative': -1,
            'neutral': 0,
            'positive': 1,
            'very_positive': 2
        };

        const scores = recent.map(h => sentimentValues[h.sentiment] || 0);
        const avgRecent = scores.reduce((a, b) => a + b, 0) / scores.length;
        const direction = avgRecent > 0 ? 'improving' : avgRecent < 0 ? 'declining' : 'stable';

        return direction;

    }

    /**
     * Arricchisci con relazioni
     */
    async enrichWithRelationships(workingMemory, identity, context) {

        if (!context.memory || !context.memory.getRelationship) {
            return;
        }

        try {

            // Ottieni la relazione con l'utente
            const relationship = await context.memory.getRelationship(identity.id);

            if (relationship) {

                workingMemory.awareness.contextualState.relationship = {
                    trustLevel: relationship.trust || 0,
                    familiarityLevel: relationship.familiarity || 0,
                    lastInteraction: relationship.lastInteraction,
                    interactionFrequency: relationship.frequency,
                    preferredCommunicationStyle: relationship.style,
                    knownPreferences: relationship.preferences || []
                };

                // Aggiungi relazione come contesto di attenzione
                workingMemory.addRelevantMemory({
                    type: 'relationship',
                    data: relationship,
                    timestamp: Date.now(),
                    relevance: Math.min(relationship.trust || 0.5, 1)
                });

            }

        } catch (e) {
            console.log('[ContextEnrichment] Errore nel recupero relazioni:', e.message);
        }

    }

    /**
     * Arricchisci con knowledge
     */
    async enrichWithKnowledge(workingMemory, identity, context) {

        if (!context.memory || !context.memory.getKnowledge) {
            return;
        }

        try {

            // Estrai topics/keywords dal messaggio
            const topics = this.extractTopics(context.event?.text);

            for (const topic of topics.slice(0, 5)) {

                const knowledge = await context.memory.getKnowledge(topic, identity.id);

                if (knowledge && Array.isArray(knowledge)) {

                    knowledge.slice(0, this.config.maxKnowledgeItems).forEach(item => {
                        workingMemory.addRelevantMemory({
                            type: 'knowledge',
                            topic: topic,
                            data: item,
                            timestamp: Date.now(),
                            relevance: 0.8
                        });
                    });

                }

            }

        } catch (e) {
            console.log('[ContextEnrichment] Errore nel recupero knowledge:', e.message);
        }

    }

    /**
     * Arricchisci con pattern storici
     */
    async enrichWithHistoricalPatterns(workingMemory, identity, context) {

        if (!context.history) {
            return;
        }

        try {

            // Analizza pattern di comunicazione
            const patterns = {
                frequencyByDay: this.analyzeFrequencyByDay(context.history),
                responseTiming: this.analyzeResponseTiming(context.history),
                topicPreferences: this.analyzeTopicPreferences(context.history),
                sentimentPatterns: this.analyzeSentimentPatterns(context.history)
            };

            workingMemory.awareness.contextualState.historicalPatterns = patterns;

            // Se ci sono pattern significativi, aggiungili come opportunità
            if (patterns.frequencyByDay.mostActive) {
                workingMemory.addOpportunity(
                    `Utente è più attivo ${patterns.frequencyByDay.mostActive}`,
                    'medium'
                );
            }

        } catch (e) {
            console.log('[ContextEnrichment] Errore nell\'analisi pattern:', e.message);
        }

    }

    /**
     * Analizza frequenza per giorno della settimana
     */
    analyzeFrequencyByDay(history) {

        if (!history || history.length === 0) {
            return { mostActive: null, pattern: {} };
        }

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const pattern = {};

        days.forEach(day => pattern[day] = 0);

        history.forEach(event => {
            const date = new Date(event.timestamp);
            const day = days[date.getDay()];
            pattern[day]++;
        });

        const mostActive = Object.entries(pattern).sort((a, b) => b[1] - a[1])[0];

        return {
            mostActive: mostActive ? mostActive[0] : null,
            pattern: pattern
        };

    }

    /**
     * Analizza timing della risposta
     */
    analyzeResponseTiming(history) {

        if (!history || history.length < 2) {
            return { averageResponseTime: 0, patterns: [] };
        }

        const responseTimes = [];

        for (let i = 1; i < history.length; i++) {
            if (history[i].actor !== history[i - 1].actor) {
                const time = history[i].timestamp - history[i - 1].timestamp;
                responseTimes.push(time);
            }
        }

        const avg = responseTimes.length > 0 
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
            : 0;

        return {
            averageResponseTime: avg,
            count: responseTimes.length
        };

    }

    /**
     * Analizza preferenze di topic
     */
    analyzeTopicPreferences(history) {

        if (!history) return {};

        const topics = {};

        history.forEach(event => {
            const topic = event.classification?.topic || 'unknown';
            topics[topic] = (topics[topic] || 0) + 1;
        });

        return topics;

    }

    /**
     * Analizza pattern del sentiment
     */
    analyzeSentimentPatterns(history) {

        if (!history) return {};

        const sentiments = {};

        history.forEach(event => {
            const sentiment = event.perception?.sentiment || 'neutral';
            sentiments[sentiment] = (sentiments[sentiment] || 0) + 1;
        });

        return sentiments;

    }

    /**
     * Estrai topic dal testo
     */
    extractTopics(text) {

        if (!text) return [];

        // Estrai parole chiave (semplice: parole lunghe > 4 caratteri)
        const words = text.toLowerCase()
            .match(/\b\w{4,}\b/g) || [];

        // Rimuovi stopwords comuni
        const stopwords = ['come', 'fare', 'cosa', 'quale', 'quanto', 'dove', 'quando', 'perché'];
        return words.filter(w => !stopwords.includes(w)).slice(0, 5);

    }

    /**
     * Arricchisci con eventi correlati
     */
    async enrichWithRelatedEvents(workingMemory, context) {

        try {

            // Se ci sono topic o intent, cerca eventi correlati
            const intent = workingMemory.cognition.intent;
            const focus = workingMemory.attention.focus;

            if (intent || focus) {

                // Simula la ricerca di eventi correlati
                const relatedEvents = this.findRelatedEvents(
                    context.event,
                    context.history || [],
                    intent || focus
                );

                relatedEvents.slice(0, this.config.maxRelatedEvents).forEach(event => {
                    workingMemory.addRelevantEvent(event);
                });

            }

        } catch (e) {
            console.log('[ContextEnrichment] Errore negli eventi correlati:', e.message);
        }

    }

    /**
     * Trova eventi correlati
     */
    findRelatedEvents(currentEvent, history, intent) {

        if (!history) return [];

        // Filtra eventi con lo stesso intent o topic
        return history
            .filter(e => e.classification?.intent === intent)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5);

    }

    /**
     * Arricchisci con contesto emotivo storico
     */
    async enrichWithEmotionalContext(workingMemory, identity, context) {

        try {

            if (context.memory && context.memory.getEmotionalHistory) {

                const emotionalHistory = await context.memory.getEmotionalHistory(identity.id);

                if (emotionalHistory) {

                    workingMemory.awareness.emotionalState = {
                        current: workingMemory.cognition.emotion,
                        historical: emotionalHistory,
                        averageTone: this.calculateAverageTone(emotionalHistory),
                        recentTrend: this.calculateEmotionalTrend(emotionalHistory)
                    };

                }

            }

        } catch (e) {
            console.log('[ContextEnrichment] Errore nel contesto emotivo:', e.message);
        }

    }

    /**
     * Calcola il tono medio
     */
    calculateAverageTone(emotionalHistory) {

        if (!emotionalHistory || emotionalHistory.length === 0) return 'neutral';

        const emotionValues = {
            'joy': 2,
            'happiness': 2,
            'contentment': 1,
            'neutral': 0,
            'sadness': -1,
            'anger': -2,
            'frustration': -1
        };

        const scores = emotionalHistory.map(e => emotionValues[e.emotion] || 0);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

        return avg > 0.5 ? 'positive' : avg < -0.5 ? 'negative' : 'neutral';

    }

    /**
     * Calcola trend emotivo
     */
    calculateEmotionalTrend(emotionalHistory) {

        if (!emotionalHistory || emotionalHistory.length < 2) return 'stable';

        const recent = emotionalHistory.slice(-5);

        const emotionValues = {
            'joy': 2,
            'happiness': 2,
            'contentment': 1,
            'neutral': 0,
            'sadness': -1,
            'anger': -2,
            'frustration': -1
        };

        const scores = recent.map(e => emotionValues[e.emotion] || 0);
        const avgRecent = scores.reduce((a, b) => a + b, 0) / scores.length;

        return avgRecent > 0.5 ? 'improving' : avgRecent < -0.5 ? 'declining' : 'stable';

    }

    /**
     * Arricchisci con vincoli e opportunità
     */
    async enrichWithConstraintsAndOpportunities(workingMemory, context) {

        try {

            // Se hai agenda, aggiungi vincoli
            if (context.agenda) {

                const constraints = context.agenda.constraints || [];
                constraints.forEach(c => {
                    workingMemory.addThreat(c.description, c.severity || 'medium');
                });

            }

            // Identifica opportunità dalle priorità
            const priorities = workingMemory.attention.priorities || [];
            if (priorities.length > 0) {

                const topPriority = priorities[0];
                if (topPriority.weight > 0.7) {
                    workingMemory.addOpportunity(
                        `Priorità alta: ${topPriority.priority}`,
                        'high'
                    );
                }

            }

        } catch (e) {
            console.log('[ContextEnrichment] Errore nei vincoli/opportunità:', e.message);
        }

    }

}

module.exports = ContextEnrichment;
