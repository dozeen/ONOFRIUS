/**
 * test-agenda-intent-execution.js - Test di verifica dell'Esecuzione Deterministica degli Intent Agenda in ONOFRIUS
 */

const AgendaEngine = require("./packages/gordon-core/agenda/AgendaEngine");
const AgendaCapability = require("./packages/gordon-core/capability/AgendaCapability");
const CapabilityRouter = require("./packages/gordon-core/capability/CapabilityRouter");
const FactVerifier = require("./packages/gordon-core/cognition/facts/FactVerifier");

async function runTest() {
    console.log("=========================================");
    console.log("TEST ESECUZIONE DETERMINISTICA INTENT AGENDA");
    console.log("=========================================\n");

    const today = new Date().toISOString().split("T")[0];

    const ctx1 = { text: "quali sono gli appuntamenti di oggi?" };
    const res1 = await CapabilityRouter.execute(ctx1);
    console.log("Capability Result 1:", res1);
    console.log("Context Response 1:\n", ctx1.response);
    console.log("Skip LLM:", ctx1.skipLLM);

    if (res1.handled && typeof ctx1.response === "string" && ctx1.response.length > 0 && ctx1.skipLLM === true) {
        console.log("✅ TEST 1 PASSED: Query intercettata ed eseguita deterministicamente senza invocare l'LLM.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    AgendaEngine.add({
        title: "Riunione con Mario TEST",
        date: today,
        time: "10:30",
        person: "Mario"
    });

    const ctx2 = { text: "cosa ho in agenda oggi?" };
    const res2 = await CapabilityRouter.execute(ctx2);
    console.log("Context Response 2:\n", ctx2.response);

    if (res2.handled && ctx2.response.includes("Riunione con Mario TEST")) {
        console.log("✅ TEST 2 PASSED: Elenco deterministico dell'agenda formattato correttamente.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    const hallucinatedLLMReply = "Controlla l'app dei meeting sul PC per vedere gli orari.";
    const verifyResult = FactVerifier.verify(hallucinatedLLMReply, { text: "quali sono gli appuntamenti di oggi?" });
    console.log("FactVerifier Result:", verifyResult);

    if (verifyResult.valid === false && verifyResult.replaced === true && verifyResult.response.includes("Riunione con Mario TEST")) {
        console.log("✅ TEST 3 PASSED: Allucinazione operativa bloccata e sostituita con i dati reali dell'AgendaEngine!\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL AGENDA INTENT EXECUTION & ANTI-HALLUCINATION TESTS PASSED SUCCESSFULLY!");
}

runTest();
