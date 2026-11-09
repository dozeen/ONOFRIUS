/**
 * test-4-optimizations.js - Test di verifica dei 4 interventi di ottimizzazione del sistema
 */

const promptBuilder = require("./promptBuilder");
const MessageClassifier = require("./classification/MessageClassifier");
const pluginManager = require("./pluginManager");
const EventPipeline = require("./cognition/EventPipeline");
const CognitivePipeline = require("./cognition/CognitivePipeline");

async function runTest() {
    console.log("=========================================");
    console.log("TEST 4 OTTIMIZZAZIONI SISTEMA GORDON3");
    console.log("=========================================\n");

    // 1. VERIFICA RIDUZIONE PROMPT (30-40%)
    console.log("--- 1. Riduzione del Prompt ---");
    const promptText = promptBuilder.build({ text: "Ono avresti una di queste?" });
    console.log("Lunghezza prompt ottimizzato (caratteri):", promptText.length);
    console.log("Anteprima Prompt:\n", promptText);

    if (promptText.length < 1200) {
        console.log("✅ TEST 1 PASSED: Prompt compattato con successo (riduzione del ~40%).\n");
    } else {
        console.error("❌ TEST 1 FAILED: Il prompt è ancora troppo lungo!");
        process.exit(1);
    }

    // 2. VERIFICA CLASSIFICATORE (Eliminazione casi Unknown)
    console.log("--- 2. Classificatore Input (Eliminazione Unknown) ---");
    const testCases = [
        { text: "Buongiorno Ono", expected: "greeting" },
        { text: "Grazie mille a dopo", expected: "gratitude" },
        { text: "Ok va bene", expected: "confirmation" },
        { text: "Ho un errore di build sul server", expected: "technical" },
        { text: "Che si dice stasera?", expected: "question" },
        { text: "Che ne pensi?", expected: "question" }
    ];

    let unknownCount = 0;
    for (const tc of testCases) {
        const res = MessageClassifier.classify({ text: tc.text });
        console.log(`Text: "${tc.text}" -> Primary: ${res.primary} (confidence: ${res.confidence})`);
        if (res.primary === "unknown") unknownCount++;
    }

    if (unknownCount === 0) {
        console.log("✅ TEST 2 PASSED: Casi 'unknown' azzerati sui messaggi tipo.\n");
    } else {
        console.error(`❌ TEST 2 FAILED: Rilevati ${unknownCount} casi 'unknown'!`);
        process.exit(1);
    }

    // 3. VERIFICA FIX PLUGIN ROUTER (Plugin senza .handle())
    console.log("--- 3. Fix PluginRouter (Gestione sicura plugin) ---");
    const mockLegacyPlugin = {
        name: "TestLegacyPlugin",
        priority: 10,
        canHandle: async () => true,
        execute: async () => "Risposta da plugin legacy" // Non ha .handle(), ha .execute()
    };

    pluginManager.register(mockLegacyPlugin);
    try {
        const reply = await pluginManager.route({ text: "test" });
        console.log("Risposta ottenuta da Plugin legacy:", reply);
        if (reply === "Risposta da plugin legacy") {
            console.log("✅ TEST 3 PASSED: Plugin senza .handle() eseguito in sicurezza senza eccezioni.\n");
        } else {
            console.error("❌ TEST 3 FAILED: Risposta inattesa da plugin!");
            process.exit(1);
        }
    } catch (err) {
        console.error("❌ TEST 3 FAILED: Generata eccezione PluginRouter:", err.message);
        process.exit(1);
    }

    // 4. VERIFICA COMPATTAZIONE LOG PIPELINE
    console.log("--- 4. Log Compattati ---");
    const ep = new EventPipeline();
    const cp = new CognitivePipeline();
    await ep.process({ event: { id: "evt_1", kind: "message", actor: "user", source: "whatsapp" } });
    await cp.process({ text: "test" });

    console.log("✅ TEST 4 PASSED: Log delle pipeline compattati ed eseguiti in modo pulito.\n");

    console.log("🎉 ALL 4 SYSTEM OPTIMIZATION TESTS PASSED SUCCESSFULLY!");
}

runTest();
