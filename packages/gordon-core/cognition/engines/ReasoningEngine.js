const Engine = require("../Engine");
const Reasoner = require("../../reasoning/reasoner");

class ReasoningEngine extends Engine {

    constructor() {
        super("Reasoning",30);
        this.reasoner = new Reasoner();
    }

    async process(context){

        context.analysis =
            this.reasoner.analyze(context);

        return context;

    }

}

module.exports = ReasoningEngine;
