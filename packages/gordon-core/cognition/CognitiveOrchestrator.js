/**
 * CognitiveOrchestrator.js - Orchestratore unificato del Sistema Operativo Cognitivo Gordon 3
 * Integrate con CognitiveProfiler, QuestionClassifier (Assioma 11) e RelevanceFilter.
 */

const { buildContext } = require("../perception/contextBuilder");
const FactExtractor = require("./facts/FactExtractor");
const FactRegistry = require("./facts/FactRegistry");
const FactVerifier = require("./facts/FactVerifier");
const { InputClassifier } = require("./InputClassifier");
const { QuestionClassifier } = require("./QuestionClassifier");
const InteractionEngine = require("./interaction/InteractionEngine");
const AttentionEngineV2 = require("./attention/AttentionEngineV2");
const SystemObserver = require("../observers/SystemObserver");
const SocialObserver = require("../observers/SocialObserver");
let ThoughtStream;
try { ThoughtStream = require("../memory/thoughts/ThoughtStream"); } catch (e) {
    try { ThoughtStream = require("../../memory/thoughts/ThoughtStream"); } catch (e2) {
        ThoughtStream = class DummyTS { getInnerWorld() { return {}; } addIntention() {} };
    }
}
const Brain = require("../brain/Brain");
let BashAgent;
try { BashAgent = require("../agents/bash/BashAgent"); } catch (e) {
    try { BashAgent = require("../../agents/bash/BashAgent"); } catch (e2) {
        BashAgent = class DummyBash { process() {} };
    }
}
const LearningEngine = require("../learning/LearningEngine");
const CognitiveProfiler = require("./profiler/CognitiveProfiler");
const StatusHandler = require("../brain/handlers/StatusHandler");
const logger = require("../logger");

class CognitiveOrchestrator {
    constructor(opts = {}) {
        this.factExtractor = opts.factExtractor || new FactExtractor();
        this.factRegistry = opts.factRegistry || new FactRegistry();
        this.factVerifier = opts.factVerifier || new FactVerifier();
        this.inputClassifier = opts.inputClassifier || new InputClassifier();
        this.questionClassifier = opts.questionClassifier || new QuestionClassifier();
        this.interactionEngine = opts.interactionEngine || new InteractionEngine();
        this.attentionEngine = opts.attentionEngine || new AttentionEngineV2();
        this.systemObserver = opts.systemObserver || new SystemObserver();
        this.socialObserver = opts.socialObserver || new SocialObserver();
        this.thoughtStream = opts.thoughtStream || new ThoughtStream();
        this.brain = opts.brain || new Brain();
        this.bashAgent = opts.bashAgent || new BashAgent();
        this.statusHandler = opts.statusHandler || new StatusHandler({
            factExtractor: this.factExtractor,
            factRegistry: this.factRegistry
        });
        this.learningEngine = opts.learningEngine || new LearningEngine({
            thoughtStream: this.thoughtStream,
            factRegistry: this.factRegistry,
            profileStore: this.interactionEngine.profileStore
        });
    }

    /**
     * Raccoglie tutte le entità presenti nell'intero contesto (pensieri, agenda, storia)
     */
    _collectAllContextEntities(context, incomingEntities = []) {
        const entities = [...incomingEntities];

        try {
            const innerWorld = this.thoughtStream.getInnerWorld();
            const textToExtract = [];

            if (innerWorld.intentions) {
                innerWorld.intentions.forEach(i => textToExtract.push(i.content));
            }
            if (innerWorld.thoughts) {
                innerWorld.thoughts.forEach(t => textToExtract.push(t.content));
            }
            if (context.agendaContext && Array.isArray(context.agendaContext)) {
                context.agendaContext.forEach(ev => textToExtract.push(`${ev.title || ""} ${ev.time || ""}`));
            }

            textToExtract.forEach(str => {
                if (str) {
                    const extracted = this.factExtractor.extract(str);
                    if (extracted.entities) {
                        entities.push(...extracted.entities);
                    }
                }
            });
        } catch (err) {
            // Fallback silente
        }

        return entities;
    }

    /**
     * Processa uno stimolo o un evento attraverso il ciclo cognitivo completo
     * @param {Object} eventOrContext - Evento o contesto
     * @returns {Object} Context arricchito e validato
     */
    async processEvent(eventOrContext) {
        const profiler = new CognitiveProfiler();
        profiler.startTotal();

        console.log("➡️ TRACE 5: Orchestrator -> processEvent() INIZIO");
        logger.info("CognitiveOrchestrator", "🧠 Inizio ciclo cognitivo per evento");

        let context;

        // 1. PERCEPTION / CONTEXT BUILD
        profiler.start("Perception");
        try {
            if (eventOrContext && eventOrContext.payload && eventOrContext.payload.raw) {
                context = await buildContext(eventOrContext);
            } else {
                context = eventOrContext || {};
            }
        } catch (err) {
            logger.warn("CognitiveOrchestrator", `Context building fallback: ${err.message}`);
            context = eventOrContext || {};
        }
        profiler.end("Perception");

        context.profiler = profiler;

        // 1.5 STATUS BROADCAST (Percezione Passiva del Mondo)
        if (context.isStatus || context.isPassivePerception) {
            logger.info("CognitiveOrchestrator", "👁 Percezione Passiva: Status Broadcast rilevato.");
            await this.statusHandler.process(context);
            console.log(profiler.formatSummary());
            return context;
        }

        const inputText = (context.text || context.message || "").trim();
        const hasMedia = context.media && (context.media.hasMedia === true || (context.media.type && context.media.type !== 'chat') || context.media.url);

        // 1.6 PROTEZIONE MESSAGGI VUOTI
        if (!inputText && !hasMedia) {
            logger.info("CognitiveOrchestrator", "🛑 Messaggio vuoto senza media. Interrompo ciclo cognitivo.");
            context.skipLLM = true;
            context.isCognitiveNote = true;
            context.response = undefined;
            console.log(profiler.formatSummary());
            return context;
        }

        // 2. OBSERVERS
        if (inputText) {
            const trendAlert = this.socialObserver.observeMessage({ text: inputText, sender: context.sender });
            if (trendAlert) context.socialTrend = trendAlert;
        }

        // 3. FACT EXTRACTION & REGISTRY
        profiler.start("FactEngine");
        const factsPayload = this.factExtractor.extract(inputText, {
            timestamp: context.timestamp,
            source: context.sender || "event"
        });
        if (factsPayload.facts && factsPayload.facts.length > 0) {
            for (const fact of factsPayload.facts) {
                this.factRegistry.register(fact);
            }
        }
        profiler.end("FactEngine");

        // 4. INPUT CLASSIFICATION & QUESTION INTENT (ASSIOMA 11)
        const classification = this.inputClassifier.classify(inputText, factsPayload);
        context.inputClassification = classification;

        if (classification.isConversation) {
            const questionIntent = this.questionClassifier.classifyIntent(inputText);
            context.questionIntent = questionIntent;
            logger.info("CognitiveOrchestrator", `❓ Intenzione Comunicativa Domanda: [${questionIntent.intent}]`);
        }

        // 5. THOUGHT STREAM & INNER WORLD
        profiler.start("Thought");
        if (factsPayload.thoughts && factsPayload.thoughts.length > 0) {
            for (const thought of factsPayload.thoughts) {
                this.thoughtStream.addIntention(thought.content, thought);
            }
        }
        if (factsPayload.preferences && factsPayload.preferences.length > 0) {
            for (const pref of factsPayload.preferences) {
                this.thoughtStream.addPreference(pref.content, pref);
            }
        }
        profiler.end("Thought");

        context.facts = factsPayload;

        // 6. ATTENTION ENGINE V2
        profiler.start("Attention");
        const attention = this.attentionEngine.evaluateAttention(context);
        context.attention = attention;
        profiler.end("Attention");

        // 7. INTERACTION ENGINE
        profiler.start("Interaction");
        const interactionStyle = this.interactionEngine.evaluateStyle(context);
        
        if (context.questionIntent && context.questionIntent.directive) {
            interactionStyle.directives.push(context.questionIntent.directive);
        }

        context.interactionStyle = interactionStyle;
        profiler.end("Interaction");

        // REGOLA FONDAMENTALE DI AUTONOMIA E RISPOSTA:
        // I messaggi inviati dall'Owner o da Gordon stesso (fromMe: true) vengono APPRESI (fatti/pensieri),
        // MA NON DEVONO MAI GENERARE UNA RISPOSTA AUTOMATICA LLM PER EVITARE AUTO-RISPOSTE O LOOP!
        const isFromMe = context.fromMe || context.isOwner || context.origin === "owner" || context.origin === "gordon" || (context.payload?.raw?.fromMe);

        if (isFromMe || (classification.isCognitiveNote && !classification.isConversation)) {
            logger.info("CognitiveOrchestrator", `📝 Messaggio da Owner/Gordon o Nota Cognitiva [${classification.category}] appresa. Salto generazione LLM.`);
            context.isCognitiveNote = true;
            context.skipLLM = true;
            context.response = undefined;
            
            console.log(profiler.formatSummary());
            return context;
        }

        // 8. BRAIN PROCESS (Conversazione da Contatti Esterni)
        console.log("➡️ TRACE 6: Orchestrator -> Brain.process() INIZIO per messaggio da contatto esterno");
        await this.brain.process(context);

        // 9. FACT & PRIVACY VERIFIER GATEKEEPING
        if (context.response) {
            profiler.start("Verifier");
            const allEntities = this._collectAllContextEntities(context, factsPayload.entities);
            const verification = this.factVerifier.verify(context.response, allEntities, context);
            context.verification = verification;

            if (!verification.valid) {
                logger.warn("CognitiveOrchestrator", `🛑 FactVerifier/PrivacyGuard ha bloccato la risposta: ${verification.reason}`);
                context.responseBlocked = true;
                context.responseError = verification.reason;
            } else {
                logger.info("CognitiveOrchestrator", "✅ FactVerifier: Risposta verificata e approvata");
                context.responseBlocked = false;
            }
            profiler.end("Verifier");
        }

        console.log("========== FINE ORCHESTRATOR ==========");
        console.log("context.response:", context.response);
        console.log("context.skipLLM:", context.skipLLM);
        console.log("context.responseBlocked:", context.responseBlocked);
        console.log("=======================================");

        console.log(profiler.formatSummary());
        return context;
    }
}

module.exports = CognitiveOrchestrator;
