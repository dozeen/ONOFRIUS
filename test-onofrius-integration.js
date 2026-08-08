const gordonCore = require("gordon-core");
const assert = require("assert");

async function testOnofriusUnification() {
    console.log("=========================================");
    console.log("TEST ONOFRIUS - GORDON CORE UNIFICATION");
    console.log("=========================================");

    console.log("1. Checking Gordon Core imports in ONOFRIUS:");
    console.log("- CognitiveOrchestrator:", !!gordonCore.CognitiveOrchestrator);
    console.log("- Brain:", !!gordonCore.Brain);
    console.log("- FactRegistry:", !!gordonCore.FactRegistry);
    console.log("- KnowledgeFusionEngine:", !!gordonCore.KnowledgeFusionEngine);
    console.log("- MemoryDecayEngine:", !!gordonCore.MemoryDecayEngine);

    assert.ok(gordonCore.CognitiveOrchestrator, "CognitiveOrchestrator must be exported");
    assert.ok(gordonCore.KnowledgeFusionEngine, "KnowledgeFusionEngine must be exported");
    assert.ok(gordonCore.MemoryDecayEngine, "MemoryDecayEngine must be exported");

    const orchestrator = new gordonCore.CognitiveOrchestrator();

    // Test 1: Status Broadcast Passive Perception in ONOFRIUS
    const mockStatus = {
        id: "onofrius_status_01",
        metadata: { chatId: "status@broadcast", sender: "393338887766@c.us" },
        payload: {
            text: "È morto il Papa",
            raw: { from: "status@broadcast", type: "chat", body: "È morto il Papa", getChat: async () => ({}), getContact: async () => ({ pushname: "ContattoF" }) }
        }
    };

    const ctx = await orchestrator.processEvent(mockStatus);
    console.log("\nStatus Broadcast Test in ONOFRIUS:");
    console.log("- isStatus:", ctx.isStatus);
    console.log("- skipLLM:", ctx.skipLLM);
    console.log("- worldEvent author:", ctx.worldEvent?.author);

    assert.strictEqual(ctx.isStatus, true);
    assert.strictEqual(ctx.skipLLM, true);
    assert.strictEqual(ctx.worldEvent?.author, "ContattoF");

    // Test 2: Knowledge Fusion & Dynamic Confidence in ONOFRIUS
    const fusion = new gordonCore.KnowledgeFusionEngine();
    let facts = [];
    const f1 = fusion.fuse(facts, { statement: "È morto il Papa", source: "Status", author: "ContattoF", confidence: 0.70 });
    facts.push(f1.fact);
    const f2 = fusion.fuse(facts, { statement: "Hai sentito che è morto il Papa?", source: "Message", author: "Marco", confidence: 0.80 });

    console.log("\nKnowledge Fusion Test in ONOFRIUS:");
    console.log("- Sources:", f2.fact.sources.length);
    console.log("- Confidence:", f2.fact.confidence);
    console.log("- Epistemic State:", f2.fact.epistemicState);

    assert.strictEqual(f2.fact.sources.length, 2);
    assert.ok(f2.fact.confidence > 0.85);
    assert.strictEqual(f2.fact.epistemicState, "CERTAINTY");

    console.log("\n🎉 ONOFRIUS IS FULLY UNIFIED WITH GORDON CORE! ALL TESTS PASSED!");
}

testOnofriusUnification().catch(err => {
    console.error("❌ ONOFRIUS UNIFICATION TEST FAILED:", err);
    process.exit(1);
});
