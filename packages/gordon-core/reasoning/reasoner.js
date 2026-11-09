class Reasoner {

    analyze(message) {

        return {

            facts: [],

            beliefs: [],

            intent: null,

            constraints: [],

            decisions: [],

            contradictions: [],

            summary: ""

        };

    }

}

module.exports = Reasoner;
