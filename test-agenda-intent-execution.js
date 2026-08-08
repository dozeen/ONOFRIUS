/**
 * test-agenda-intent-execution.js - Test di Esecuzione Deterministica degli Intent Agenda & ResponseGuard Anti-Allucinazione in ONOFRIUS
 */

const AgendaCapability = require("./packages/gordon-core/capability/AgendaCapability");
const AgendaEngine = require("./packages/gordon-core/agenda/AgendaEngine");
const FactVerifier = require("./packages/gordon-core/cognition/facts/FactVerifier");

async function runTest() {
    console.log("=========================================");
    console.log("TEST ESECUZIONE DETERMINISTICA INTENT AGENDA");
    console.log("=========================================\n");

    const today = new Date().toISOString().split("T")[0];
    AgendaEngine.add({
        date: today,
        time: "10:30",
        title: "Riunione con Mario TEST",
        person: "Mario"
    });

    const ctxQuery = { text: "quali sono gli appuntamenti di oggi?" };
    const capRes1 = await AgendaCapability.execute(ctxQuery);
    console.log("Capability Result 1:", capRes1);
    console.log("Context Response 1:\n", ctxQuery.response);

    if (capRes1.handled === true && ctxQuery.skipLLM === true && ctxQuery.response.includes("Riunione con Mario TEST")) {
        console.log("✅ TEST 1 PASSED: Query intercettata ed eseguita deterministicamente senza invocare l'LLM.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    const ctxEstrazione = { text: "cosa devo fare oggi?" };
    await AgendaCapability.execute(ctxEstrazione);
    console.log("Context Response 2:\n", ctxEstrazione.response);

    if (ctxEstrazione.response.includes("Riunione con Mario TEST")) {
        console.log("✅ TEST 2 PASSED: Elenco deterministico dell'agenda formattato correttamente.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    const hallucinatedCandidate = "Appuntamenti oggi? Niente urgenti. Stai tranquillo e goditi le ore che hai davanti. 😄";
    const verifierRes = FactVerifier.verify(hallucinatedCandidate, { text: "quali sono gli appuntamenti di oggi?" });
    console.log("FactVerifier Result:", verifierRes);

    if (verifierRes.valid === false && verifierRes.replaced === true && verifierRes.response.includes("Riunione con Mario TEST")) {
        console.log("✅ TEST 3 PASSED: Allucinazione operativa bloccata e sostituita con i dati reali dell'AgendaEngine!\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    const ctxEscapato = { text: '\"quali sono gli appuntamenti di oggi?\", \"cosa devo fare oggi?\", \"appuntamenti di domani\"' };
    const capRes4 = await AgendaCapability.execute(ctxEscapato);
    console.log("Context Response 4 (Input Escapato):\n", ctxEscapato.response);

    if (capRes4.handled === true && ctxEscapato.skipLLM === true && (ctxEscapato.response.includes("Riunione con Mario TEST") || ctxEscapato.response.includes("appuntamenti"))) {
        console.log("✅ TEST 4 PASSED: Query con virgolette escapate intercettata ed eseguita deterministicamente!\n");
    } else {
        console.error("❌ TEST 4 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL AGENDA INTENT EXECUTION & ANTI-HALLUCINATION TESTS PASSED SUCCESSFULLY!");
}

runTest();
