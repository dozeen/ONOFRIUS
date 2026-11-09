/**
 * test-gordon-personality.js - Test del Gordon Personality Engine & Conversational Identity
 */

const personality = require("./personality/PersonalityEngine");
const moodEvaluator = require("./cognition/interaction/InteractionMoodEvaluator");
const ResponseHandler = require("./brain/handlers/ResponseHandler");
const responseHandler = new ResponseHandler();

async function runTest() {
    console.log("=========================================");
    console.log("TEST GORDON PERSONALITY ENGINE & IDENTITY");
    console.log("=========================================\n");

    // TEST 1: Sanitizzazione Cliché Assistente Commerciale & Emoji
    console.log("--- TEST 1: Anti-Assistant Sanitizer & Emoji Removal ---");
    const rawLLMResponse = "Certamente! Fantastico! Come posso aiutarti oggi? 🤖☀️ Ho completato il controllo del kernel.";
    const sanitized = personality.sanitize(rawLLMResponse);
    console.log("Input LLM  :", rawLLMResponse);
    console.log("Output Clean:", sanitized);

    if (!sanitized.includes("Fantastico") && !sanitized.includes("aiutarti") && !sanitized.includes("☀️") && sanitized.includes("Ho completato il controllo del kernel.")) {
        console.log("✅ TEST 1 PASSED: Cliché ed emoji rimossi con successo.\n");
    } else {
        console.error("❌ TEST 1 FAILED: Sanitizzazione non riuscita!");
        process.exit(1);
    }

    // TEST 2: Presenza Sociale Variabile in base a ConversationMood
    console.log("--- TEST 2: Presenza Sociale Variabile (ConversationMood) ---");
    
    // 2.1 Ritorno dopo ore
    const moodAfterHours = moodEvaluator.evaluateMood({ text: "Ciao Gordon", timeSinceLastMessage: 18000000 });
    const greetingAfterHours = personality.generateGreeting(moodAfterHours);
    console.log("Mood (After Hours) -> Greeting:", greetingAfterHours);
    if (greetingAfterHours.includes("Bentornato")) {
        console.log("✅ TEST 2.1 PASSED: Bentornato generato correttamente.\n");
    } else {
        console.error("❌ TEST 2.1 FAILED!");
        process.exit(1);
    }

    // 2.2 Owner message
    const moodOwner = moodEvaluator.evaluateMood({ text: "Gordon ci sei?", isOwner: true });
    const greetingOwner = personality.generateGreeting(moodOwner);
    console.log("Mood (Owner) -> Greeting:", greetingOwner);
    if (greetingOwner === "Dimmi.") {
        console.log("✅ TEST 2.2 PASSED: Saluto Owner naturale ('Dimmi.').\n");
    } else {
        console.error("❌ TEST 2.2 FAILED!");
        process.exit(1);
    }

    // 2.3 Testo lungo
    const moodLong = moodEvaluator.evaluateMood({ text: "A".repeat(300) });
    const greetingLong = personality.generateGreeting(moodLong);
    console.log("Mood (Long Text) -> Greeting:", greetingLong);
    if (greetingLong === "Ho letto tutto. Dimmi pure.") {
        console.log("✅ TEST 2.3 PASSED: Gestione testo lungo ('Ho letto tutto. Dimmi pure.').\n");
    } else {
        console.error("❌ TEST 2.3 FAILED!");
        process.exit(1);
    }

    // 2.4 Discussione tecnica
    const moodTech = moodEvaluator.evaluateMood({ text: "C'è un problema di build nel codice node" });
    const greetingTech = personality.generateGreeting(moodTech);
    console.log("Mood (Technical) -> Greeting:", greetingTech);
    if (greetingTech.includes("Ti ascolto")) {
        console.log("✅ TEST 2.4 PASSED: Presenza per discussione tecnica.\n");
    } else {
        console.error("❌ TEST 2.4 FAILED!");
        process.exit(1);
    }

    // TEST 3: Integrazione ResponseHandler
    console.log("--- TEST 3: ResponseHandler Integration ---");
    let ctx = {
        chatId: "test_personality_chat",
        response: "Perfetto! ☀️ Ho analizzato il log di sistema."
    };

    await responseHandler.process(ctx);
    console.log("Risposta formattata da ResponseHandler:\n" + ctx.response);

    if (ctx.response.includes("Ho analizzato il log di sistema.") && !ctx.response.includes("☀️") && !ctx.response.includes("Perfetto")) {
        console.log("✅ TEST 3 PASSED: ResponseHandler integra perfettamente PersonalityEngine.\n");
    } else {
        console.error("❌ TEST 3 FAILED: Integrazione ResponseHandler fallita!");
        process.exit(1);
    }

    console.log("🎉 ALL GORDON PERSONALITY TESTS PASSED SUCCESSFULLY!");
}

runTest();
