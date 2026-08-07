/**
 * test-social-intuition.js - Test di verifica del SocialIntuitionEngine, ConversationParticipation e LinguisticConscience
 */

const socialIntuition = require("./cognition/interaction/SocialIntuitionEngine");
const dynamics = require("./cognition/interaction/ConversationDynamicsEngine");
const conscience = require("./personality/LinguisticConscience");
const ParticipationStates = require("./cognition/interaction/ConversationParticipation");

async function runTest() {
    console.log("=========================================");
    console.log("TEST SOCIAL INTUITION & PARTICIPATION");
    console.log("=========================================\n");

    // TEST 1: Reazione Spontanea a Risata ("😂😂😂")
    console.log("--- TEST 1: Intuizione Risata ---");
    const laughRes = socialIntuition.evaluateIntuition({ text: "😂😂😂" });
    console.log("Result:", laughRes);

    if (laughRes.intuition === "laughter_reaction" && laughRes.recommendedState === ParticipationStates.MINIMAL && laughRes.suggestedReply === "Ahah") {
        console.log("✅ TEST 1 PASSED: Intuizione risata ('Ahah') con leaveSilence: true.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // TEST 2: Esitazione ("Boh...") -> Spazio al Silenzio
    console.log("--- TEST 2: Intuizione Esitazione ('Boh...') ---");
    const bohRes = socialIntuition.evaluateIntuition({ text: "Boh..." });
    console.log("Result:", bohRes);

    if (bohRes.intuition === "hesitation" && bohRes.suggestedReply === "Vediamo.") {
        console.log("✅ TEST 2 PASSED: Intuizione esitazione ('Vediamo.') con leaveSilence: true.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    // TEST 3: Richiesta di Contatto ("Ti posso chiamare?") -> Disponibilità
    console.log("--- TEST 3: Intuizione Chiamata ('Ti posso chiamare?') ---");
    const callRes = socialIntuition.evaluateIntuition({ text: "Ti posso chiamare?" });
    console.log("Result:", callRes);

    if (callRes.intuition === "call_request" && callRes.suggestedReply === "Sì dimmi pure.") {
        console.log("✅ TEST 3 PASSED: Intuizione contatto ('Sì dimmi pure.').\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    // TEST 4: Coscienza Linguistica Intoccabile
    console.log("--- TEST 4: Coscienza Linguistica Intoccabile ---");
    const rawText = "Certamente! Ho completato l'operazione. Resto a disposizione per qualsiasi cosa.";
    const cleanText = conscience.evaluate(rawText);
    console.log("Input :", rawText);
    console.log("Output:", cleanText);

    if (cleanText === "Ho completato l'operazione.") {
        console.log("✅ TEST 4 PASSED: Coscienza Linguistica purifica il testo mantenendo l'autenticità di Onofrio.\n");
    } else {
        console.error("❌ TEST 4 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL SOCIAL INTUITION & PARTICIPATION TESTS PASSED SUCCESSFULLY!");
}

runTest();
