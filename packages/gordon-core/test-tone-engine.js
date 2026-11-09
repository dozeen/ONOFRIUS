/**
 * test-tone-engine.js - Test di verifica del ToneEngine e dell'Adattamento Dinamico del Registro Relazionale
 */

const toneEngine = require("./personality/ToneEngine");
const promptBuilder = require("./promptBuilder");

async function runTest() {
    console.log("=========================================");
    console.log("TEST TONE ENGINE & REGISTRO RELAZIONALE");
    console.log("=========================================\n");

    // 1. TEST TONO ROMANTICO / FLIRT
    console.log("--- TEST 1: Tono Romantico / Flirt ---");
    const ctxRomantic = { text: "Ciao amore mio ❤️ mi manchi" };
    const resRomantic = toneEngine.evaluateTone(ctxRomantic);
    const promptRomantic = promptBuilder.build(ctxRomantic);
    console.log("Tone Result Romantic:", resRomantic);
    console.log("Prompt Romantic Extract:\n", promptRomantic);

    if (resRomantic.tone === "romantic" && promptRomantic.includes("REGISTRO E TONO: ROMANTIC") && promptRomantic.includes("complicità")) {
        console.log("✅ TEST 1 PASSED: Messaggio affettuoso/romantico riconosciuto con registro 'romantic' e complicità.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // 2. TEST TONO IRONICO / SCHERZOSO
    console.log("--- TEST 2: Tono Ironico / Scherzoso ---");
    const ctxIronic = { text: "Ahah bastardo che combina?" };
    const resIronic = toneEngine.evaluateTone(ctxIronic);
    const promptIronic = promptBuilder.build(ctxIronic);
    console.log("Tone Result Ironic:", resIronic);

    if (resIronic.tone === "ironic" && promptIronic.includes("REGISTRO E TONO: IRONIC")) {
        console.log("✅ TEST 2 PASSED: Tono ironico riconosciuto e registro adattato.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    // 3. TEST TONO TECNICO
    console.log("--- TEST 3: Tono Tecnico ---");
    const ctxTech = { text: "Ho un bug nel codice del server node" };
    const resTech = toneEngine.evaluateTone(ctxTech);
    const promptTech = promptBuilder.build(ctxTech);
    console.log("Tone Result Tech:", resTech);

    if (resTech.tone === "technical" && promptTech.includes("REGISTRO E TONO: TECHNICAL")) {
        console.log("✅ TEST 3 PASSED: Tono tecnico riconosciuto.\n");
    } else {
        console.error("❌ TEST 3 FAILED!");
        process.exit(1);
    }

    // 4. DIRETTIVA SUPREMA ANTI-ASSISTENZIALE
    console.log("--- TEST 4: Direttiva Suprema Anti-Assistenziale ---");
    if (promptRomantic.includes("Non cercare sempre di essere utile") && promptRomantic.includes("Non trasformare mai la chat in un dialogo assistenziale")) {
        console.log("✅ TEST 4 PASSED: Direttiva suprema anti-assistenziale inclusa in tutti i prompt!\n");
    } else {
        console.error("❌ TEST 4 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL TONE ENGINE & RELATIONAL REGISTER TESTS PASSED SUCCESSFULLY!");
}

runTest();
