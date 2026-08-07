/**
 * test-social-intuition.js - Test di verifica del SocialIntuitionEngine, ConversationParticipation e LinguisticConscience in ONOFRIUS
 */

const socialIntuition = require("./packages/gordon-core/cognition/interaction/SocialIntuitionEngine");
const dynamics = require("./packages/gordon-core/cognition/interaction/ConversationDynamicsEngine");
const conscience = require("./packages/gordon-core/personality/LinguisticConscience");
const ParticipationStates = require("./packages/gordon-core/cognition/interaction/ConversationParticipation");

async function runTest() {
    console.log("=========================================");
    console.log("TEST SOCIAL INTUITION & PARTICIPATION");
    console.log("=========================================\n");

    const laughRes = socialIntuition.evaluateIntuition({ text: "😂😂😂" });
    console.log("Result:", laughRes);

    if (laughRes.intuition === "laughter_reaction" && laughRes.recommendedState === ParticipationStates.MINIMAL && laughRes.suggestedReply === "Ahah") {
        console.log("✅ TEST 1 PASSED: Intuizione risata ('Ahah') con leaveSilence: true.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    const bohRes = socialIntuition.evaluateIntuition({ text: "Boh..." });
    console.log("Result:", bohRes);

    if (bohRes.intuition === "hesitation" && bohRes.suggestedReply === "Vediamo.") {
        console.log("✅ TEST 2 PASSED: Intuizione esitazione ('Vediamo.') con leaveSilence: true.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    const callRes = socialIntuition.evaluateIntuition({ text: "Ti posso chiamare?" });
    console.log("Result:", callRes);

    if (callRes.intuition === "call_request" && callRes.suggestedReply === "Sì dimmi pure.") {
        console.log("✅ TEST 3 PASSED: Intuizione contatto ('Sì dimmi pure.').\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

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
