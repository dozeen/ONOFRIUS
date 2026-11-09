const Engine = require("../Engine");
const Perception = require("../../perception");

class PerceptionEngine extends Engine {

    constructor() {
        super("Perception", 10);
    }

    async process(context) {

        context.perception = await Perception({

            message: context.text,

            history: context.history,

            contact: context.contact

        });

        return context;

    }

}

module.exports = PerceptionEngine;
