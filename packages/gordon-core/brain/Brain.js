const ChatControlHandler = require("./handlers/ChatControlHandler");
const AgendaReasoningHandler = require("./handlers/AgendaReasoningHandler");
const LearningHandler = require("./handlers/LearningHandler");
const PluginRouterHandler = require("./handlers/PluginRouterHandler");
const IdentityHandler = require("./handlers/IdentityHandler");
const ConversationHandler = require("./handlers/ConversationHandler");
const WorkingMemoryHandler = require("./handlers/WorkingMemoryHandler");
const HistoryHandler = require("./handlers/HistoryHandler");
const MemoryHandler = require("./handlers/MemoryHandler");
const AgendaHandler = require("./handlers/AgendaHandler");
const ContextEnrichment = require("../cognition/ContextEnrichment");
const AttentionEngine = require("../cognition/AttentionEngine");
const EventPipeline = require("../cognition/EventPipeline");
const CognitivePipeline = require("../cognition/CognitivePipeline");
const CapabilityHandler = require("./handlers/CapabilityHandler");
const DecisionHandler = require("./handlers/DecisionHandler");
const ResponseHandler = require("./handlers/ResponseHandler");

class Brain {
    constructor() {
        this.pipeline = [
            new ChatControlHandler(),
            new IdentityHandler(),
            new WorkingMemoryHandler(),
            new ConversationHandler(),
            new HistoryHandler(),
            new MemoryHandler(),
            new AgendaHandler(),
            new ContextEnrichment(),
            new AttentionEngine(),
            new LearningHandler(),
            new EventPipeline(),
            new CognitivePipeline(),
            new AgendaReasoningHandler(),
            new CapabilityHandler(),
            new DecisionHandler(),
            new PluginRouterHandler(),
            new ResponseHandler()
        ];
    }

    async process(context) {
        console.log("➡️ TRACE 6.1: Brain.process() INIZIO");
        console.log("🧠 ===== NUOVO BRAIN =====");

        for (const stage of this.pipeline) {
            const stageName = stage.constructor.name;
            console.log("➡", stageName);

            try {
                await stage.process(context);
            } catch (err) {
                console.error(`❌ Errore nello stage ${stageName}:`, err.message);
                console.error(err.stack);

                if (!context.errors) context.errors = [];
                context.errors.push({ stage: stageName, error: err.message });

                if (stage.critical) {
                    console.error("🛑 Stage critico fallito, interrompo la pipeline.");
                    break;
                }
            }
        }

        console.log("➡️ TRACE 6.5: Brain.process() FINE");
        console.log("✅ BRAIN TERMINATO\n");
        return context;
    }
}

module.exports = Brain;
