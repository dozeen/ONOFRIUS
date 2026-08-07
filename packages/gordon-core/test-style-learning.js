/**
 * test-style-learning.js - Test di verifica di StyleLearningEngine e dei Prompt Few-Shot Canonici
 */

const styleLearning = require("./learning/StyleLearningEngine");
const promptBuilder = require("./promptBuilder");

async function runTest() {
    console.log("=========================================");
    console.log("TEST STYLE LEARNING ENGINE & FEW-SHOTS");
    console.log("=========================================\n");

    // TEST 1: Classificazione Speech Act & Esempi Canonici
    console.log("--- TEST 1: Estrazione Esempi Canonici per Speech Act ---");
    const phoneExemplars = styleLearning.getCanonicalExemplars("Mi fai uno squillo quando ti liberi?");
    console.log("Speech Act:", phoneExemplars.speechAct);
    console.log("Esempi Canonici:", phoneExemplars.examples);

    if (phoneExemplars.speechAct === "phone_request" && phoneExemplars.examples.includes("Ti chiamo.")) {
        console.log("✅ TEST 1 PASSED: Esempi canonici estratti correttamente per 'phone_request'.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // TEST 2: Iniezione Few-Shot Exemplars nel Prompt
    console.log("--- TEST 2: Iniezione Few-Shot Exemplars in PromptBuilder ---");
    const ctx = { text: "Quando puoi chiamami" };
    const promptText = promptBuilder.build(ctx);
    console.log("PROMPT GENERATO CON ESEMPI CANONICI:\n");
    console.log(promptText);

    if (promptText.includes("ESEMPI CANONICI REALI DI ONOFRIO") && promptText.includes("Ti chiamo.")) {
        console.log("\n✅ TEST 2 PASSED: Gli esempi canonici reali sono stati iniettati nel prompt!\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    // TEST 3: Apprendimento Dinamico di una Nuova Risposta Reale dell'Owner
    console.log("--- TEST 3: Apprendimento Dinamico Nuova Risposta Owner ---");
    styleLearning.learnRealOwnerReply("Ti posso chiamare ora?", "Richiamo dopo.");
    const updatedExemplars = styleLearning.getCanonicalExemplars("Ti posso chiamare?");
    console.log("Esempi aggiornati per availability/phone_request:", updatedExemplars.examples);

    if (updatedExemplars.examples.includes("Richiamo dopo.")) {
        console.log("✅ TEST 3 PASSED: Nuova risposta reale appresa ed integrata in memoria!\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL STYLE LEARNING ENGINE TESTS PASSED SUCCESSFULLY!");
}

runTest();
