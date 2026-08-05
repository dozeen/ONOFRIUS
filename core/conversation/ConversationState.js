class ConversationState {

    constructor() {

        this.facts = [];

    }

    addFact(fact) {

        const existing = this.facts.find(f => f.key === fact.key);

        if (existing) {

            existing.value = fact.value;
            existing.timestamp = fact.timestamp;

            return;

        }

        this.facts.push(fact);

    }

    get(key) {

        return this.facts.find(f => f.key === key);

    }

    all() {

        return this.facts;

    }

    toJSON() {

        return {

            facts: this.facts

        };

    }

}

module.exports = ConversationState;
