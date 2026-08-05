const ConversationState = require("./ConversationState");
const ConversationFacts = require("./ConversationFacts");
class ConversationEngine {

    constructor() {

        this.states = new Map();

        this.extractor =
            new ConversationFacts();

    }

    process(context) {

        let state =
            this.states.get(context.chatId);

        if (!state) {

            state =
                new ConversationState();

            this.states.set(
                context.chatId,
                state
            );

        }

        const facts =
            this.extractor.extract(context);

        for (const fact of facts) {

            state.addFact(fact);

        }

        return state;

    }

}

module.exports = ConversationEngine;
