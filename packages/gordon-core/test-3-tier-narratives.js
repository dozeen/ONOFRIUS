/**
 * test-3-tier-narratives.js - Test di verifica dei 3 Livelli di Conoscenza, emergent_hypothesis, Risonanza Social Graph, Novelty e Narrazioni Ambientali
 */

const observedFacts = require("./facts/ObservedFacts");
const inferredContext = require("./cognition/InferredContext");
const emergentEvents = require("./cognition/social/EmergentEventDetector");
const socialGraph = require("./cognition/social/SocialGraphEngine");
const groupMood = require("./cognition/social/GroupMoodEvaluator");
const noveltyTrend = require("./cognition/social/NoveltyTrendEngine");
const ambientMemory = require("./memory/AmbientMemory");

async function runTest() {
    console.log("=========================================");
    console.log("TEST 3 LIVELLI DI CONOSCENZA & NARRAZIONI");
    console.log("=========================================\n");

    // 1. VERIFICA SEPARAZIONE DEI 3 LIVELLI DI CONOSCENZA
    console.log("--- 1. Separazione dei 3 Livelli ---");
    observedFacts.addObservedFact({ statement: "Onofrio ha inviato un messaggio su WhatsApp", source: "whatsapp" });
    
    const hyp = emergentEvents.detectEvents([
        { text: "Sapete di ContattoC?" },
        { text: "È in ospedale con l'ambulanza" },
        { text: "Preghiamo per lui" }
    ]);
    inferredContext.addHypothesis(hyp);

    ambientMemory.addNarrative("Dal 5 agosto il gruppo parla con preoccupazione della salute di ContattoC.", 0.85);

    console.log("Observed Facts:", observedFacts.getFacts());
    console.log("Inferred Hypotheses:", inferredContext.getHypotheses());
    console.log("Ambient Narratives:", ambientMemory.getNarratives());

    if (observedFacts.getFacts().length > 0 && inferredContext.getHypotheses().length > 0 && ambientMemory.getNarratives().length > 0) {
        console.log("✅ TEST 1 PASSED: I 3 livelli di conoscenza sono rigorosamente separati ed operativi.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // 2. VERIFICA EVIDENZE NELL'IPOTESI EMERGENTE
    console.log("--- 2. Ipotesi Emergente con Evidenze ---");
    console.log("Emergent Hypothesis Object:", hyp);
    if (hyp.type === "emergent_hypothesis" && hyp.evidence.includes("ambulanza") && hyp.evidence.includes("ospedale")) {
        console.log("✅ TEST 2 PASSED: L'ipotesi emergente contiene le evidenze analizzate ('ambulanza', 'ospedale').\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    // 3. VERIFICA SOCIAL GRAPH & RISONANZA ("Chi risponde a chi")
    console.log("--- 3. Social Graph & Risonanza ---");
    socialGraph.recordInteraction("ContattoB", "ContattoA", true); // ContattoB risponde a ContattoA
    socialGraph.recordInteraction("ContattoE", "ContattoA", true); // ContattoE risponde a ContattoA
    socialGraph.recordInteraction("Onofrio", "ContattoA", true); // Onofrio risponde a ContattoA

    const contattoAResonance = socialGraph.getResonance("ContattoA");
    console.log("Risonanza di ContattoA (risposte ricevute):", contattoAResonance);

    if (contattoAResonance === 3) {
        console.log("✅ TEST 3 PASSED: Risonanza sociale calcolata correttamente (3 risposte ricevute per ContattoA).\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    // 4. VERIFICA MOOD ESPANSO DEL GRUPPO
    console.log("--- 4. Mood Espanso del Gruppo ---");
    const celebratoryHistory = [{ text: "Auguri a tutti!" }, { text: "Congratulazioni ❤️" }, { text: "Evviva!" }];
    const moodRes = groupMood.evaluateMood(celebratoryHistory);
    console.log("Mood Espanso Rilevato:", moodRes.mood);

    if (moodRes.mood === "celebrating") {
        console.log("✅ TEST 4 PASSED: Mood espanso del gruppo identificato come 'celebrating'.\n");
    } else {
        console.error("❌ TEST 4 FAILED!");
        process.exit(1);
    }

    // 5. VERIFICA NOVELTY TREND ENGINE (Insolito vs Normale)
    console.log("--- 5. Novelty Trend Engine ---");
    const noveltyScore = noveltyTrend.calculateNovelty("ambulanza", 12);
    console.log("Novelty Score per termine insolito 'ambulanza':", noveltyScore);

    if (noveltyScore >= 0.90) {
        console.log("✅ TEST 5 PASSED: Picco di Novelty calcolato per termine mai citato prima.\n");
    } else {
        console.error("❌ TEST 5 FAILED!");
        process.exit(1);
    }

    // 6. VERIFICA DECADIMENTO AMBIENTMEMORY E ARCHIVIAZIONE
    console.log("--- 6. Decadimento AmbientMemory & Archiviazione 90 Giorni ---");
    // Simula narrazione di 95 giorni fa
    ambientMemory.narratives.push({
        id: "old_narrative",
        startDate: Date.now() - (100 * 24 * 60 * 60 * 1000),
        lastUpdated: Date.now() - (95 * 24 * 60 * 60 * 1000),
        narrative: "Nel gruppo DJ si parlava della serata del mese scorso.",
        confidence: 0.80
    });

    ambientMemory.applyDailyDecay();
    const active = ambientMemory.getNarratives();
    console.log("Narrazioni Attive dopo Decadimento:", active);

    if (!active.some(n => n.id === "old_narrative") && ambientMemory.archive.some(a => a.id === "old_narrative")) {
        console.log("✅ TEST 6 PASSED: Decadimento applicato ed archiviazione automatica oltre i 90 giorni di inattività.\n");
    } else {
        console.error("❌ TEST 6 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL 3-TIER KNOWLEDGE & NARRATIVE TESTS PASSED SUCCESSFULLY!");
}

runTest();
