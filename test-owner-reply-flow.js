/**
 * test-owner-reply-flow.js - Verfica che i messaggi in ingresso inviati dall'Owner ricevano risposta
 */

const { CognitiveOrchestrator, EventBuilder } = require("./packages/gordon-core");

async function runTest() {
    console.log("=========================================");
    console.log("TEST OWNER INCOMING MESSAGE REPLY FLOW");
    console.log("=========================================\n");

    const orchestrator = new CognitiveOrchestrator();

    const ownerEvent = EventBuilder.fromWhatsApp({
        id: { remote: "393663580128@c.us", fromMe: false },
        from: "393663580128@c.us",
        to: "393000000000@c.us",
        fromMe: false, // In arrivo dal telefono dell'Owner
        body: "Ciao Gordon, come va?",
        timestamp: Math.floor(Date.now() / 1000)
    });

    console.log("Processamento messaggio in ingresso dall'Owner (fromMe: false)...");
    const ctx = await orchestrator.processEvent(ownerEvent);

    console.log("risultato context:");
    console.log("- isOwner:", ctx.isOwner);
    console.log("- fromMe:", ctx.fromMe);
    console.log("- skipLLM:", ctx.skipLLM);
    console.log("- isCognitiveNote:", ctx.isCognitiveNote);

    if (ctx.skipLLM !== true && ctx.isCognitiveNote !== true) {
        console.log("\n✅ TEST PASSED: I messaggi dell'Owner in ingresso NON vengono scartati e passano al Brain!");
    } else {
        console.error("\n❌ TEST FAILED: Il messaggio dell'Owner in ingresso è stato erroneamente saltato!");
        process.exit(1);
    }
}

runTest();
