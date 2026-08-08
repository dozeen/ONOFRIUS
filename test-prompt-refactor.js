/**
 * test-prompt-refactor.js - Test di verifica della ristrutturazione di PromptBuilder in Gordon3 / ONOFRIUS
 */

const promptBuilder = require("./packages/gordon-core/promptBuilder");

async function runTest() {
    console.log("=========================================");
    console.log("TEST GORDON3 PROMPTBUILDER REFACTORING");
    console.log("=========================================\n");

    const sampleContext = {
        text: "Ono avresti una di queste?",
        contactName: "ContattoE",
        isOwner: false,
        agenda_probability: 0.2,
        agendaContext: {
            relevantEvents: [{ title: "Riunione", date: "Domani 10:00" }]
        }
    };

    const promptText = promptBuilder.build(sampleContext);
    console.log("PROMPT GENERATO:\n");
    console.log(promptText);
    console.log("\n-----------------------------------------");
    console.log("Lunghezza caratteri prompt:", promptText.length);

    if (promptText.includes("undefined")) {
        console.error("❌ TEST 1 FAILED: Il prompt contiene ancora la parola 'undefined'!");
        process.exit(1);
    } else {
        console.log("✅ TEST 1 PASSED: Nessun 'undefined' presente nel prompt.");
    }

    if (promptText.includes("FORMALITY LEVEL") || promptText.includes("EMOJI 30%") || promptText.includes("AFFECTION")) {
        console.error("❌ TEST 2 FAILED: Trovati livelli percentuali meccanici nel prompt!");
        process.exit(1);
    } else {
        console.log("✅ TEST 2 PASSED: Livelli percentuali meccanici eliminati.");
    }

    if (promptText.includes("AGENDA & IMPEGNI")) {
        console.error("❌ TEST 3 FAILED: L'agenda è stata erroneamente inclusa per un messaggio non inerente!");
        process.exit(1);
    } else {
        console.log("✅ TEST 3 PASSED: Agenda esclusa correttamente (agenda_probability < 0.7).");
    }

    const agendaContextSample = {
        text: "Potresti prestarcela per domani?",
        contactName: "ContattoE",
        isOwner: false,
        agenda_probability: 0.85,
        agendaContext: {
            relevantEvents: [{ title: "Prestito Strumento", date: "Domani 15:00" }]
        }
    };
    const agendaPromptText = promptBuilder.build(agendaContextSample);
    if (agendaPromptText.includes("AGENDA & IMPEGNI") && agendaPromptText.includes("Prestito Strumento")) {
        console.log("✅ TEST 4 PASSED: Agenda inclusa dinamicamente quando pertinente (agenda_probability >= 0.7).");
    } else {
        console.error("❌ TEST 4 FAILED: Agenda non inclusa quando pertinente!");
        process.exit(1);
    }

    console.log("\n🎉 ALL PROMPTBUILDER REFACTORING TESTS PASSED SUCCESSFULLY!");
}

runTest();
