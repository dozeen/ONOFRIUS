const PerceptionEngine = require("./engines/PerceptionEngine");
const ClassificationEngine = require("../classification/ClassificationEngine");
const ReasoningEngine = require("./engines/ReasoningEngine");
const logger = require("../logger");

class CognitivePipeline {
    constructor() {
        this.engines = [
            new PerceptionEngine(),
            new ClassificationEngine(),
            new ReasoningEngine()
        ];
    }

    async process(context) {
        logger.debug("CognitivePipeline", "🧠 [CognitivePipeline] Avvio ciclo di percezione, classificazione e reasoning");
        for (const engine of this.engines) {
            await engine.process(context);
        }
        return context;
    }
}

module.exports = CognitivePipeline;
