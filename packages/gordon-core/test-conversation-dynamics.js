/**
 * test-conversation-dynamics.js - Test di verifica della Coscienza Linguistica & ConversationDynamicsEngine
 */

const dynamics = require("./cognition/interaction/ConversationDynamicsEngine");
const personality = require("./personality/PersonalityEngine");

async function runTest() {
    console.log("=========================================");
    console.log("TEST CONVERSATION DYNAMICS & CONSCIENCE");
    console.log("=========================================\n");

    // TEST 1: Chiusura Conversazione (Non avere l'ultima parola)
    console.log("--- TEST 1: Chiusura Conversazione (Non avere l'ultima parola) ---");
    const closingContext = { text: "Grazie mille a dopo!", isOwner: true };
    const dyn1 = dynamics.evaluateDynamics(closingContext);
    console.log("Dynamics Result:", dyn1);

    if (dyn1.energy === 0 && dyn1.shouldCloseConversation && dyn1.suggestedReply === "Ok.") {
        console.log("✅ TEST 1 PASSED: Conversazione chiusa correttamente con risposte sintetiche ('Ok.').\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // TEST 2: Coscienza Linguistica & Rimozione Cliché di Chiusura Assistenziale
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

    // TEST 3: Energia della Risposta
    console.log("--- TEST 3: Calcolo dell'Energia della Risposta ---");
    const shortDyn = dynamics.evaluateDynamics({ text: "Ok" });
    const longDyn = dynamics.evaluateDynamics({ text: "C'è un errore grave di build durante la compilazione del pacchetto node" });

    console.log("Short Text Energy:", shortDyn.energy, "| Mode:", shortDyn.participationMode);
    console.log("Long Text Energy :", longDyn.energy, "| Mode:", longDyn.participationMode);

    if (shortDyn.energy === 0 && longDyn.energy === 2) {
        console.log("✅ TEST 3 PASSED: Energia calcolata dinamicamente (0 vs 2).\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL CONVERSATION DYNAMICS TESTS PASSED SUCCESSFULLY!");
}

runTest();
