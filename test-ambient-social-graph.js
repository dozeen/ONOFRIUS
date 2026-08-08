/**
 * test-ambient-social-graph.js - Test di verifica di AmbientMemory e Social Graph in ONOFRIUS
 */

const socialGraph = require("./packages/gordon-core/cognition/social/SocialGraphEngine");
const groupMood = require("./packages/gordon-core/cognition/social/GroupMoodEvaluator");
const emergentEvents = require("./packages/gordon-core/cognition/social/EmergentEventDetector");
const ambientMemory = require("./packages/gordon-core/memory/AmbientMemory");

async function runTest() {
    console.log("=========================================");
    console.log("TEST AMBIENT MEMORY & SOCIAL GRAPH ENGINE");
    console.log("=========================================\n");

    socialGraph.recordInteraction("Sabino", "Silvana", "Ciao Silvana");
    socialGraph.recordInteraction("Christian", "Onofrio", "Ono hai visto?");
    socialGraph.graph["Lucia"] = { interactsWith: {}, lastSeen: Date.now() - (18 * 24 * 60 * 60 * 1000) };

    const inactive = socialGraph.getInactiveContacts(7);
    console.log("Contatti inattivi:", inactive);

    if (inactive.some(i => i.person === "Lucia" && i.inactiveDays >= 18)) {
        console.log("✅ TEST 1 PASSED: Lucia identificata come inattiva da 18 giorni.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    const historyJokes = [
        { text: "Ahah fantastico" },
        { text: "Che battuta!" },
        { text: "😂 troppo forte" },
        { text: "Sì vero" }
    ];
    const moodResult = groupMood.evaluateMood(historyJokes);
    console.log("Mood Gruppo:", moodResult);

    if (moodResult.mood === "lighthearted" && moodResult.breakdown.jokesPct > 40) {
        console.log("✅ TEST 2 PASSED: Mood del gruppo identificato come 'lighthearted'.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    const healthHistory = [
        { text: "Sapete di Antonio?" },
        { text: "È in ospedale da stamattina" },
        { text: "Speriamo bene per l'intervento" }
    ];
    const eventDetected = emergentEvents.detectEvents(healthHistory);
    console.log("Evento Rilevato:", eventDetected);

    if (eventDetected && eventDetected.category === "health_event" && eventDetected.title.includes("Antonio")) {
        console.log("✅ TEST 3 PASSED: Evento emergente correlato rilevato ('Antonio - Evento di salute / ricovero').\n");

        ambientMemory.addPhenomenon(eventDetected);
        const phenomena = ambientMemory.getRecentPhenomena();
        console.log("Fenomeni in AmbientMemory:", phenomena);

        if (phenomena.some(p => p.title.includes("Antonio"))) {
            console.log("✅ TEST 4 PASSED: Fenomeno sociale memorizzato in AmbientMemory (senza salvare frasi grezze).\n");
        } else {
            console.error("❌ TEST 4 FAILED!");
            process.exit(1);
        }
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL AMBIENT MEMORY & SOCIAL GRAPH TESTS PASSED SUCCESSFULLY!");
}

runTest();
