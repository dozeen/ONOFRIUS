/**
 * test-conversation-dynamics.js - Test di verifica della Coscienza Linguistica & ConversationDynamicsEngine
 */

const dynamics = require("./packages/gordon-core/cognition/interaction/ConversationDynamicsEngine");
const personality = require("./packages/gordon-core/personality/PersonalityEngine");
const ParticipationStates = require("./packages/gordon-core/cognition/interaction/ConversationParticipation");

async function runTest() {
    console.log("=========================================");
    console.log("TEST CONVERSATION DYNAMICS & CONSCIENCE");
    console.log("=========================================\n");

    console.log("--- TEST 1: Chiusura Conversazione (Non avere l'ultima parola) ---");
    const closingContext = { text: "Grazie mille a dopo!", isOwner: true };
    const dyn1 = dynamics.evaluateDynamics(closingContext);
    console.log("Dynamics Result:", dyn1);

    if (dyn1.participation === ParticipationStates.MINIMAL && dyn1.leaveSilence && dyn1.suggestedReply === "Ok.") {
        console.log("✅ TEST 1 PASSED: Conversazione chiusa correttamente con risposte sintetiche ('Ok.').\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    console.log("--- TEST 2: Rimozione Cliché di Chiusura Assistenziale ---");
    const rawResponse = "Ho sistemato il file di build. Resto a disposizione per qualsiasi cosa.";
    const cleanResponse = personality.evalLinguisticConscience(rawResponse);
    console.log("Input  :", rawResponse);
    console.log("Output :", cleanResponse);

    if (!cleanResponse.includes("Resto a disposizione") && cleanResponse === "Ho sistemato il file di build.") {
        console.log("✅ TEST 2 PASSED: Cliché assistenziale rimosso dalla Coscienza Linguistica.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    console.log("--- TEST 3: Calcolo della Partecipazione Conversazionale ---");
    const shortDyn = dynamics.evaluateDynamics({ text: "Ok" });
    const longDyn = dynamics.evaluateDynamics({ text: "C'è un errore grave di build durante la compilazione del pacchetto node" });

    console.log("Short Text Participation:", shortDyn.participation);
    console.log("Long Text Participation :", longDyn.participation);

    if (shortDyn.participation === ParticipationStates.MINIMAL && longDyn.participation === ParticipationStates.ADVISOR) {
        console.log("✅ TEST 3 PASSED: Partecipazione calcolata dinamicamente (MINIMAL vs ADVISOR).\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL CONVERSATION DYNAMICS TESTS PASSED SUCCESSFULLY!");
}

runTest();
