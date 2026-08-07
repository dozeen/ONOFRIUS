/**
 * Gordon Core - Shared Cognitive Engine for Gordon & ONOFRIUS
 */

const CognitiveOrchestrator = require("./cognition/CognitiveOrchestrator");
const Brain = require("./brain/Brain");
const bus = require("./events/EventBus");
const EventBuilder = require("./events/EventBuilder");
const EventTypes = require("./events/EventTypes");
const FactRegistry = require("./cognition/facts/FactRegistry");
const FactExtractor = require("./cognition/facts/FactExtractor");
const FactVerifier = require("./cognition/facts/FactVerifier");
const KnowledgeFusionEngine = require("./cognition/facts/KnowledgeFusionEngine");
const MemoryDecayEngine = require("./cognition/facts/MemoryDecayEngine");
const { InputClassifier, INPUT_CATEGORIES } = require("./cognition/InputClassifier");
const MessageClassifier = require("./classification/MessageClassifier");
const MessageType = require("./classification/MessageType");
const IdentityResolver = require("./identity/IdentityResolver");
const FamilyPrivacyManager = require("./privacy/FamilyPrivacyManager");
let ThoughtStream; try { ThoughtStream = require("./memory/thoughts/ThoughtStream"); } catch (e) { ThoughtStream = require("../memory/thoughts/ThoughtStream"); }
const CognitiveProfiler = require("./cognition/profiler/CognitiveProfiler");
const kernel = require("./kernel");
const logger = require("./logger");

module.exports = {
    CognitiveOrchestrator,
    Brain,
    bus,
    EventBus: bus,
    EventBuilder,
    EventTypes,
    FactRegistry,
    FactExtractor,
    FactVerifier,
    KnowledgeFusionEngine,
    MemoryDecayEngine,
    InputClassifier,
    INPUT_CATEGORIES,
    MessageClassifier,
    MessageType,
    IdentityResolver,
    FamilyPrivacyManager,
    ThoughtStream,
    CognitiveProfiler,
    kernel,
    logger
};
