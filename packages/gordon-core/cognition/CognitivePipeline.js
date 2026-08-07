const PerceptionEngine = require("./engines/PerceptionEngine");
const ClassificationEngine = require("../classification/ClassificationEngine");
const ReasoningEngine = require("./engines/ReasoningEngine");

class CognitivePipeline {

    constructor() {

        this.engines = [

            new PerceptionEngine(),

            new ClassificationEngine(),

            new ReasoningEngine()

        ];

    }

    async process(context) {

        console.log("");
        console.log("🧠 Cognitive Pipeline");
        console.log("----------------------------");

        for (const engine of this.engines) {

            console.log(`➡ ${engine.name}`);

            await engine.process(context);

        }

        return context;

    }

}

module.exports = CognitivePipeline;
