/**
 * test-3-tier-narratives.js - Test di verifica dei 3 Livelli di Conoscenza e Narrazioni Ambientali in ONOFRIUS
 */

const assert = require("assert");
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

    observedFacts.addObservedFact({ statement: "L'Owner ha inviato un messaggio su WhatsApp", source: "whatsapp" });
    
    const hyp = emergentEvents.detectEvents([
        { text: "Sapete di ContattoC?" },
        { text: "È in ospedale con l'ambulanza" },
        { sender: "ContattoC", text: "Ciao a tutti" },
        { sender: "ContattoB", text: "Come stai?" },
        { sender: "ContattoC", text: "Purtroppo sono in ospedale con l'ambulanza, preghiamo vada tutto bene" }
    ]);
    inferredContext.addHypothesis(hyp);

    assert.ok(hyp, "Ipotesi emergente deve essere generata");
    assert.strictEqual(hyp.category, "health_event");
    assert.strictEqual(hyp.evidence.length, 3);
    console.log("✅ 1. Livello Inferred Context & Evidenze generato con successo:\n", hyp);

    // 2. VERIFICA RESONANCE SCORE E ATTENZIONE AMBIENTALE
    console.log("\n--- 2. Social Resonance & Attenzione Ambientale ---");
    socialGraph.recordInteraction("ContattoA", "ContattoB", false);
    socialGraph.recordInteraction("ContattoB", "ContattoA", true);
    socialGraph.recordInteraction("ContattoE", "ContattoA", true);
    socialGraph.recordInteraction("Owner", "ContattoA", true);

    const contattoAResonance = socialGraph.getResonance("ContattoA");
    if (contattoAResonance === 3) {
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
