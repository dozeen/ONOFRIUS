/**
 * AttentionEngine
 * 
 * Seleziona e filtra le informazioni rilevanti dalla WorkingMemory.
 * Riduce il rumore cognitivo e prepara il contesto per il PromptBuilder.
 * 
 * Principi:
 * - Attenzione selettiva: focus su ciò che è rilevante
 * - Gerarchizzazione: priorità basate su rilevanza
 * - Filtro: esclude informazioni irrilevanti
 * - Compressione: rappresentazione compatta del contesto
 */

class AttentionEngine {

    constructor() {

        this.config = {
            relevanceThreshold: 0.5,
            confidenceThreshold: 0.6,
            maxAttentionItems: 7,
            maxRecentMessages: 5,
            maxRecentDecisions: 3,
            maxRecentActions: 3,
            maxThreats: 3,
            maxOpportunities: 3,
            maxPriorities: 3,
            weights: {
                confidence: 0.3,
                urgency: 0.25,
                recency: 0.2,
                relevance: 0.25
            }
        };

        this.attentionCache = null;
        this.lastUpdate = null;

    }

    async process(context) {

        if (!context.workingMemory) {
            return context;
        }

        const workingMemory = context.workingMemory;

        const scoredItems = this.scoreAllItems(workingMemory);
        const relevantItems = this.filterByRelevance(scoredItems);
        const selectedItems = this.selectTopItems(relevantItems);
        const attentionContext = this.createAttentionContext(selectedItems, workingMemory);
        const promptContext = this.preparePromptContext(attentionContext, workingMemory);

        context.attention = attentionContext;
        context.promptContext = promptContext;
        context.attentionEngine = {
            processedAt: Date.now(),
            itemsConsidered: scoredItems.length,
            itemsSelected: selectedItems.total,
            relevanceScore: this.calculateOverallRelevance(selectedItems),
            confidenceLevel: this.calculateConfidenceLevel(attentionContext)
        };

        return context;

    }

    scoreAllItems(workingMemory) {

        const items = [];

        if (workingMemory.cognition.perception) {
            items.push({
                type: 'perception',
                data: workingMemory.cognition.perception,
                score: this.scorePerception(workingMemory.cognition),
                timestamp: workingMemory.createdAt
            });
        }

        if (workingMemory.cognition.intent) {
            items.push({
                type: 'intent',
                data: { intent: workingMemory.cognition.intent, urgency: workingMemory.cognition.urgency },
                score: this.scoreIntent(workingMemory.cognition),
                timestamp: workingMemory.createdAt
            });
        }

        (workingMemory.immediateMemory.recentMessages || []).forEach(msg => {
            items.push({
                type: 'recent_message',
                data: msg,
                score: this.scoreRecentMessage(msg),
                timestamp: msg.timestamp
            });
        });

        (workingMemory.attention.threats || []).forEach(threat => {
            items.push({
                type: 'threat',
                data: threat,
                score: this.scoreThreat(threat),
                timestamp: threat.timestamp
            });
        });

        (workingMemory.attention.opportunities || []).forEach(opp => {
            items.push({
                type: 'opportunity',
                data: opp,
                score: this.scoreOpportunity(opp),
                timestamp: opp.timestamp
            });
        });

        (workingMemory.attention.priorities || []).forEach(priority => {
            items.push({
                type: 'priority',
                data: priority,
                score: this.scorePriority(priority),
                timestamp: priority.timestamp
            });
        });

        (workingMemory.immediateMemory.recentDecisions || []).forEach(decision => {
            items.push({
                type: 'recent_decision',
                data: decision,
                score: this.scoreRecentDecision(decision),
                timestamp: decision.timestamp
            });
        });

        (workingMemory.immediateMemory.recentActions || []).forEach(action => {
            items.push({
                type: 'recent_action',
                data: action,
                score: this.scoreRecentAction(action),
                timestamp: action.timestamp
            });
        });

        if (workingMemory.awareness.contextualState.relationship) {
            items.push({
                type: 'relationship',
                data: workingMemory.awareness.contextualState.relationship,
                score: this.scoreRelationship(workingMemory.awareness.contextualState.relationship),
                timestamp: workingMemory.createdAt
            });
        }

        if (workingMemory.awareness.contextualState.historicalPatterns) {
            items.push({
                type: 'historical_patterns',
                data: workingMemory.awareness.contextualState.historicalPatterns,
                score: this.scoreHistoricalPatterns(workingMemory.awareness.contextualState.historicalPatterns),
                timestamp: workingMemory.createdAt
            });
        }

        if (workingMemory.awareness.emotionalState) {
            items.push({
                type: 'emotional_state',
                data: workingMemory.awareness.emotionalState,
                score: this.scoreEmotionalState(workingMemory.awareness.emotionalState),
                timestamp: workingMemory.createdAt
            });
        }

        if (workingMemory.agenda.upcomingEvents && workingMemory.agenda.upcomingEvents.length > 0) {
            items.push({
                type: 'agenda_constraints',
                data: workingMemory.agenda.upcomingEvents,
                score: this.scoreAgendaConstraints(workingMemory.agenda),
                timestamp: workingMemory.createdAt
            });
        }

        return items;

    }

    filterByRelevance(items) {

        return items.filter(item => item.score >= this.config.relevanceThreshold);

    }

    selectTopItems(items) {

        const selected = { total: 0, byType: {} };
        const byType = {};

        items.forEach(item => {
            if (!byType[item.type]) {
                byType[item.type] = [];
            }
            byType[item.type].push(item);
        });

        for (const type in byType) {

            const typeItems = byType[type].sort((a, b) => b.score - a.score);
            let limit = this.config.maxAttentionItems;

            if (type === 'recent_message') limit = this.config.maxRecentMessages;
            if (type === 'recent_decision') limit = this.config.maxRecentDecisions;
            if (type === 'recent_action') limit = this.config.maxRecentActions;
            if (type === 'threat') limit = this.config.maxThreats;
            if (type === 'opportunity') limit = this.config.maxOpportunities;
            if (type === 'priority') limit = this.config.maxPriorities;

            selected.byType[type] = typeItems.slice(0, limit);
            selected.total += selected.byType[type].length;

        }

        return selected;

    }

    createAttentionContext(selectedItems, workingMemory) {

        return {
            focus: workingMemory.attention.focus,
            cognition: {
                intent: workingMemory.cognition.intent,
                urgency: workingMemory.cognition.urgency,
                emotion: workingMemory.cognition.emotion,
                confidence: workingMemory.cognition.confidence
            },
            selectedItems: {
                perception: selectedItems.byType['perception']?.[0]?.data,
                intent: selectedItems.byType['intent']?.[0]?.data,
                recentMessages: selectedItems.byType['recent_message']?.map(i => i.data) || [],
                threats: selectedItems.byType['threat']?.map(i => i.data) || [],
                opportunities: selectedItems.byType['opportunity']?.map(i => i.data) || [],
                priorities: selectedItems.byType['priority']?.map(i => i.data) || [],
                recentDecisions: selectedItems.byType['recent_decision']?.map(i => i.data) || [],
                recentActions: selectedItems.byType['recent_action']?.map(i => i.data) || [],
                relationship: selectedItems.byType['relationship']?.[0]?.data,
                historicalPatterns: selectedItems.byType['historical_patterns']?.[0]?.data,
                emotionalState: selectedItems.byType['emotional_state']?.[0]?.data,
                agendaConstraints: selectedItems.byType['agenda_constraints']?.[0]?.data
            },
            filteredOut: {
                irrelevantItems: selectedItems.total
            }
        };

    }

    preparePromptContext(attentionContext, workingMemory) {

        return {
            mainIntent: attentionContext.cognition.intent,
            mainUrgency: attentionContext.cognition.urgency,
            emotionalTone: attentionContext.cognition.emotion,
            focus: attentionContext.focus,
            conversationContext: {
                recentMessages: attentionContext.selectedItems.recentMessages.slice(0, 3),
                topic: workingMemory.conversation?.state.topic,
                participants: Array.from(workingMemory.conversation?.participants || [])
            },
            constraints: {
                threats: attentionContext.selectedItems.threats.slice(0, 2),
                agendaConstraints: attentionContext.selectedItems.agendaConstraints
            },
            opportunities: attentionContext.selectedItems.opportunities.slice(0, 2),
            relationshipContext: attentionContext.selectedItems.relationship ? {
                trustLevel: attentionContext.selectedItems.relationship.trustLevel,
                communicationStyle: attentionContext.selectedItems.relationship.preferredCommunicationStyle
            } : null,
            topPriorities: attentionContext.selectedItems.priorities.slice(0, 2),
            requiresImmedateAction: attentionContext.selectedItems.threats.length > 0,
            hasDecisionContext: attentionContext.selectedItems.recentDecisions.length > 0,
            hasPendingActions: attentionContext.selectedItems.recentActions.length > 0
        };

    }

    scorePerception(cognition) {
        const confidence = cognition.confidence || 0.5;
        return Math.min(confidence, 1);
    }

    scoreIntent(cognition) {
        let score = 0.8;
        if (cognition.urgency === 'high') score += 0.2;
        if (cognition.urgency === 'low') score -= 0.1;
        return Math.min(score, 1);
    }

    scoreRecentMessage(msg) {
        const recency = 1 - (Date.now() - msg.timestamp) / (30 * 60 * 1000);
        const sentimentBoost = msg.sentiment === 'negative' ? 0.3 : msg.sentiment === 'positive' ? 0.1 : 0;
        return Math.max(recency + sentimentBoost, 0);
    }

    scoreThreat(threat) {
        const severityMap = { 'high': 1, 'medium': 0.7, 'low': 0.4 };
        return severityMap[threat.severity] || 0.6;
    }

    scoreOpportunity(opp) {
        const valueMap = { 'high': 0.9, 'medium': 0.7, 'low': 0.4 };
        return valueMap[opp.value] || 0.6;
    }

    scorePriority(priority) {
        return Math.min(priority.weight || 0.5, 1);
    }

    scoreRecentDecision(decision) {
        const recency = 1 - (Date.now() - decision.timestamp) / (5 * 60 * 1000);
        return Math.max(recency, 0.3);
    }

    scoreRecentAction(action) {
        const recency = 1 - (Date.now() - action.timestamp) / (5 * 60 * 1000);
        return Math.max(recency, 0.3);
    }

    scoreRelationship(relationship) {
        return Math.min((relationship.trustLevel + relationship.familiarityLevel) / 2, 1);
    }

    scoreHistoricalPatterns(patterns) {
        return 0.6;
    }

    scoreEmotionalState(emotionalState) {
        const toneMap = { 'positive': 0.8, 'neutral': 0.5, 'negative': 0.9 };
        return toneMap[emotionalState.averageTone] || 0.6;
    }

    scoreAgendaConstraints(agenda) {
        const constraintCount = (agenda.constraints || []).length;
        return Math.min(0.5 + constraintCount * 0.1, 1);
    }

    calculateOverallRelevance(selectedItems) {

        const scores = [];

        Object.values(selectedItems.byType).forEach(typeItems => {
            if (Array.isArray(typeItems)) {
                typeItems.forEach(item => {
                    if (item && item.score) {
                        scores.push(item.score);
                    }
                });
            }
        });

        if (scores.length === 0) return 0;

        return scores.reduce((a, b) => a + b, 0) / scores.length;

    }

    calculateConfidenceLevel(attentionContext) {

        let confidence = attentionContext.cognition.confidence || 0.5;

        if (attentionContext.selectedItems.recentDecisions.length > 0) {
            confidence += 0.1;
        }

        if (attentionContext.selectedItems.relationship?.trustLevel > 0.7) {
            confidence += 0.1;
        }

        if (attentionContext.selectedItems.threats.length > 0) {
            confidence -= 0.1;
        }

        return Math.min(confidence, 1);

    }

    getSnapshot() {

        return {
            attentionFocus: this.attentionCache?.focus,
            itemsSelected: this.attentionCache?.selectedItems ? 
                Object.values(this.attentionCache.selectedItems).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length 
                : 0,
            lastUpdate: this.lastUpdate
        };

    }

}

module.exports = AttentionEngine;
