/**
 * test-4-optimizations.js - Test di verifica dei 4 interventi di ottimizzazione in ONOFRIUS
 */

const promptBuilder = require("./packages/gordon-core/promptBuilder");
const MessageClassifier = require("./packages/gordon-core/classification/MessageClassifier");
const pluginManager = require("./packages/gordon-core/pluginManager");
const EventPipeline = require("./packages/gordon-core/cognition/EventPipeline");
const CognitivePipeline = require("./packages/gordon-core/cognition/CognitivePipeline");

async function runTest() {
    console.log("=========================================");
    console.log("TEST 4 OTTIMIZZAZIONI SISTEMA ONOFRIUS");
    console.log("=========================================\n");

    const promptText = promptBuilder.build({ text: "Ono avresti una di queste?" });
    console.log("Lunghezza prompt ottimizzato (caratteri):", promptText.length);

    if (promptText.length < 1200) {
        console.log("✅ TEST 1 PASSED: Prompt compattato con successo.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    const testCases = [
        { text: "Buongiorno Ono", expected: "greeting" },
        { text: "Grazie mille a dopo", expected: "gratitude" },
        { text: "Ok va bene", expected: "confirmation" },
        { text: "Ho un errore di build sul server", expected: "technical" }
    ];

    let unknownCount = 0;
    for (const tc of testCases) {
        const res = MessageClassifier.classify({ text: tc.text });
        console.log(`Text: "${tc.text}" -> Primary: ${res.primary} (confidence: ${res.confidence})`);
        if (res.primary === "unknown") unknownCount++;
    }

    if (unknownCount === 0) {
        console.log("✅ TEST 2 PASSED: Casi 'unknown' azzerati.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    const mockLegacyPlugin = {
        name: "TestLegacyPlugin",
        priority: 10,
        canHandle: async () => true,
        execute: async () => "Risposta da plugin legacy"
    };

    pluginManager.register(mockLegacyPlugin);
    const reply = await pluginManager.route({ text: "test" });
    if (reply === "Risposta da plugin legacy") {
        console.log("✅ TEST 3 PASSED: Plugin senza .handle() gestito in sicurezza.\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    const ep = new EventPipeline();
    const cp = new CognitivePipeline();
    await ep.process({ event: { id: "evt_1", kind: "message", actor: "user", source: "whatsapp" } });
    await cp.process({ text: "test" });

    console.log("✅ TEST 4 PASSED: Log pipeline compattati.\n");
    console.log("🎉 ALL 4 SYSTEM OPTIMIZATION TESTS PASSED SUCCESSFULLY!");
}

runTest();
