/**
 * test-learning-and-fact-extraction.js - Test di estrazione automatica di relazioni, preferenze ed intenzioni di comunicazione
 */

const FactExtractor = require("./cognition/facts/FactExtractor");
const factExtractor = new FactExtractor();

async function runTest() {
    console.log("=========================================");
    console.log("TEST ESTRAZIONE FATTI, RELAZIONI ED INTENZIONI");
    console.log("=========================================\n");

    // TEST 1: Estrazione Relazione Familiare e Valori/Preferenze
    console.log("--- TEST 1: Estrazione Relazione e Preferenze ---");
    const input1 = "Roberta ( mia figlia ) non fuma e neanche beve devi sconsigliare l'utilizzo di queste cattive abitudini";
    const res1 = factExtractor.extract(input1);
    console.log("Result 1:", JSON.stringify(res1, null, 2));

    if (res1.relationships.length > 0 && res1.relationships[0].person === "Roberta" && res1.relationships[0].relation === "figlia") {
        console.log("✅ TEST 1 PASSED: Relazione familiare (Roberta -> figlia) estratta correttamente.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // TEST 2: Estrazione Intenzione di Comunicazione / Outreach
    console.log("--- TEST 2: Estrazione Intenzione Outreach & Luogo ---");
    const input2 = "oggi lavoro e dovro andare a Minervino , comunicare a ContattoG che sono a Minervino a Lavorare";
    const res2 = factExtractor.extract(input2);
    console.log("Result 2:", JSON.stringify(res2, null, 2));

    const hasOutreach = res2.thoughts.some(t => t.type === "outreach_intention" && t.target.toLowerCase() === "contattog");
    const hasLocation = res2.entities.some(e => e.type === "LOCATION" && e.value === "Minervino");

    if (hasOutreach && hasLocation) {
        console.log("✅ TEST 2 PASSED: Intenzione outreach per ContattoG e luogo 'Minervino' estratti correttamente.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL FACT EXTRACTION & LEARNING TESTS PASSED SUCCESSFULLY!");
}

runTest();
