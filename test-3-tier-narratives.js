/**
 * test-3-tier-narratives.js - Test di verifica dei 3 Livelli di Conoscenza e Narrazioni Ambientali in ONOFRIUS
 */

const observedFacts = require("./packages/gordon-core/facts/ObservedFacts");
const inferredContext = require("./packages/gordon-core/cognition/InferredContext");
const emergentEvents = require("./packages/gordon-core/cognition/social/EmergentEventDetector");
const socialGraph = require("./packages/gordon-core/cognition/social/SocialGraphEngine");
const groupMood = require("./packages/gordon-core/cognition/social/GroupMoodEvaluator");
const noveltyTrend = require("./packages/gordon-core/cognition/social/NoveltyTrendEngine");
const ambientMemory = require("./packages/gordon-core/memory/AmbientMemory");

async function runTest() {
    console.log("=========================================");
    console.log("TEST 3 LIVELLI DI CONOSCENZA & NARRAZIONI");
    console.log("=========================================\n");

    observedFacts.addObservedFact({ statement: "Onofrio ha inviato un messaggio su WhatsApp", source: "whatsapp" });
    
    const hyp = emergentEvents.detectEvents([
        { text: "Sapete di Antonio?" },
        { text: "È in ospedale con l'ambulanza" },
        { text: "Preghiamo per lui" }
    ]);
    inferredContext.addHypothesis(hyp);

    ambientMemory.addNarrative("Dal 5 agosto il gruppo parla con preoccupazione della salute di Antonio.", 0.85);

    if (observedFacts.getFacts().length > 0 && inferredContext.getHypotheses().length > 0 && ambientMemory.getNarratives().length > 0) {
        console.log("✅ TEST 1 PASSED: I 3 livelli di conoscenza sono rigorosamente separati ed operativi.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    if (hyp.type === "emergent_hypothesis" && hyp.evidence.includes("ambulanza") && hyp.evidence.includes("ospedale")) {
        console.log("✅ TEST 2 PASSED: L'ipotesi emergente contiene le evidenze analizzate.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    socialGraph.recordInteraction("Sabino", "Silvana", true);
    socialGraph.recordInteraction("Christian", "Silvana", true);
    socialGraph.recordInteraction("Onofrio", "Silvana", true);

    const silvanaResonance = socialGraph.getResonance("Silvana");
    if (silvanaResonance === 3) {
        console.log("✅ TEST 3 PASSED: Risonanza sociale calcolata correttamente.\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    const celebratoryHistory = [{ text: "Auguri a tutti!" }, { text: "Congratulazioni ❤️" }, { text: "Evviva!" }];
    const moodRes = groupMood.evaluateMood(celebratoryHistory);
    if (moodRes.mood === "celebrating") {
        console.log("✅ TEST 4 PASSED: Mood espanso del gruppo identificato come 'celebrating'.\n");
    } else {
        console.error("❌ TEST 4 FAILED!");
        process.exit(1);
    }

    const noveltyScore = noveltyTrend.calculateNovelty("ambulanza", 12);
    if (noveltyScore >= 0.90) {
        console.log("✅ TEST 5 PASSED: Picco di Novelty calcolato per termine mai citato prima.\n");
    } else {
        console.error("❌ TEST 5 FAILED!");
        process.exit(1);
    }

    ambientMemory.narratives.push({
        id: "old_narrative",
        startDate: Date.now() - (100 * 24 * 60 * 60 * 1000),
        lastUpdated: Date.now() - (95 * 24 * 60 * 60 * 1000),
        narrative: "Nel gruppo DJ si parlava della serata del mese scorso.",
        confidence: 0.80
    });

    ambientMemory.applyDailyDecay();
    const active = ambientMemory.getNarratives();

    if (!active.some(n => n.id === "old_narrative") && ambientMemory.archive.some(a => a.id === "old_narrative")) {
        console.log("✅ TEST 6 PASSED: Decadimento applicato ed archiviazione automatica oltre i 90 giorni di inattività.\n");
    } else {
        console.error("❌ TEST 6 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL 3-TIER KNOWLEDGE & NARRATIVE TESTS PASSED SUCCESSFULLY!");
}

runTest();
