/**
 * ObservedFacts.js - Fatti Oggettivi e Messaggi Realmente Osservati (Tier 1: Observed Facts)
 */

class ObservedFacts {
    constructor() {
        this.facts = [];
    }

    addObservedFact(fact) {
        if (!fact || !fact.statement) return;
        this.facts.unshift({
            id: Date.now().toString(),
            timestamp: Date.now(),
            statement: fact.statement,
            source: fact.source || "observed_message",
            actor: fact.actor || "user",
            verified: true
        });
        if (this.facts.length > 100) this.facts.pop();
    }

    getFacts() {
        return this.facts;
    }
}

module.exports = new ObservedFacts();
