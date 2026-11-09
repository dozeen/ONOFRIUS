/**
 * test-group-dynamics.js - Test di verifica del GroupDynamicsEngine e del Group Participation Score
 */

const groupDynamics = require("./cognition/interaction/GroupDynamicsEngine");
const dynamics = require("./cognition/interaction/ConversationDynamicsEngine");

async function runTest() {
    console.log("=========================================");
    console.log("TEST GROUP DYNAMICS ENGINE & PARTICIPATION SCORE");
    console.log("=========================================\n");

    // SCENARIO A: Nessuno o pochissimi hanno salutato nel gruppo
    console.log("--- SCENARIO A: Primo Saluto nel Gruppo ---");
    const ctxA = {
        isGroup: true,
        text: "Buongiorno a tutti",
        history: [{ text: "Ciao raga" }]
    };
    const resA = groupDynamics.evaluateGroupDynamics(ctxA);
    console.log("Group Result A:", resA);

    if (resA.shouldStaySilent === false && resA.score >= 0) {
        console.log("✅ TEST A PASSED: Gordon partecipa al primo saluto del gruppo.\n");
    } else {
        console.error("❌ TEST A FAILED!");
        process.exit(1);
    }

    // SCENARIO C: 12 persone hanno già salutato ed il gruppo è rumoroso
    console.log("--- SCENARIO C: 12 persone hanno già salutato (Spam) ---");
    const noisyHistory = Array(16).fill({ text: "Buongiorno!" });
    const ctxC = {
        isGroup: true,
        text: "Buongiorno a tutti!",
        history: noisyHistory
    };
    const resC = groupDynamics.evaluateGroupDynamics(ctxC);
    const dynC = dynamics.evaluateDynamics(ctxC);
    console.log("Group Result C:", resC);
    console.log("Dynamics Result C:", dynC);

    if (resC.shouldStaySilent === true && dynC.participation === "silent") {
        console.log("✅ TEST C PASSED: Gordon sceglie saggiamente il SILENZIO nel gruppo (Score < 0).\n");
    } else {
        console.error("❌ TEST C FAILED!");
        process.exit(1);
    }

    // SCENARIO MENTION: Mention esplicito ("Ono ti chiamano")
    console.log("--- SCENARIO MENTION: Mention Esplicito nel Gruppo ---");
    const ctxMention = {
        isGroup: true,
        text: "Ono ci sei per la riunione?",
        history: noisyHistory
    };
    const resMention = groupDynamics.evaluateGroupDynamics(ctxMention);
    console.log("Group Result Mention:", resMention);

    if (resMention.shouldStaySilent === false && resMention.score > 0) {
        console.log("✅ TEST MENTION PASSED: Il mention esplicito ha la massima priorità e sblocca la risposta!\n");
    } else {
        console.error("❌ TEST MENTION FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL GROUP DYNAMICS ENGINE TESTS PASSED SUCCESSFULLY!");
}

runTest();
