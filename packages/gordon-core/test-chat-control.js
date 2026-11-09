/**
 * test-chat-control.js - Test Intestazione Prima Risposta & Comandi Stop/Start ONOFRIUS
 */

const Brain = require("./brain/Brain");
const chatControl = require("./chat/ChatControlManager");

async function runTest() {
    console.log("=========================================");
    console.log("TEST CHAT CONTROL & FIRST RESPONSE HEADER");
    console.log("=========================================\n");

    const brain = new Brain();
    const testChatId = "test_chat_999";

    // Resetta lo stato del test chat
    chatControl.seenChats.delete(testChatId);
    chatControl.mutedChats.delete(testChatId);
    chatControl.saveState();

    // TEST 1: Prima Risposta in nuova chat
    console.log("--- TEST 1: Prima Risposta ---");
    let ctx1 = {
        chatId: testChatId,
        senderId: testChatId,
        sender: { name: "TestUser" },
        text: "Ciao Gordon!",
        response: "Ciao! Come posso aiutarti?"
    };

    await brain.process(ctx1);
    console.log("Risposta ottenuta:\n" + ctx1.response);

    if (ctx1.response && ctx1.response.startsWith("Sistema ONOFRIUS operativo:\n\n")) {
        console.log("✅ TEST 1 PASSED: Intestazione prima risposta aggiunta correttamente.\n");
    } else {
        console.error("❌ TEST 1 FAILED: Intestazione non trovata!");
        process.exit(1);
    }

    // TEST 2: Seconda Risposta nella stessa chat
    console.log("--- TEST 2: Risposta Successiva ---");
    let ctx2 = {
        chatId: testChatId,
        senderId: testChatId,
        sender: { name: "TestUser" },
        text: "Che tempo fa?",
        response: "Oggi c'è il sole."
    };

    await brain.process(ctx2);
    console.log("Risposta ottenuta:\n" + ctx2.response);

    if (ctx2.response && !ctx2.response.startsWith("Sistema ONOFRIUS operativo:") && ctx2.response === "Oggi c'è il sole.") {
        console.log("✅ TEST 2 PASSED: Nessuna intestazione per le risposte successive.\n");
    } else {
        console.error("❌ TEST 2 FAILED: Intestazione erroneamente ripetuta!");
        process.exit(1);
    }

    // TEST 3: Comando "stop onofrius"
    console.log("--- TEST 3: Comando 'stop onofrius' ---");
    let ctx3 = {
        chatId: testChatId,
        senderId: testChatId,
        sender: { name: "TestUser" },
        text: "stop onofrius"
    };

    await brain.process(ctx3);
    console.log("Risposta ottenuta:\n" + ctx3.response);

    if (ctx3.response && ctx3.response.includes("Sistema ONOFRIUS disattivato in questa chat")) {
        console.log("✅ TEST 3 PASSED: Chat silenziata correttamente.\n");
    } else {
        console.error("❌ TEST 3 FAILED: Risposta di stop non corretta!");
        process.exit(1);
    }

    // TEST 4: Messaggio in chat silenziata
    console.log("--- TEST 4: Messaggio durante ammutolimento ---");
    let ctx4 = {
        chatId: testChatId,
        senderId: testChatId,
        sender: { name: "TestUser" },
        text: "Ci sei?",
        response: "Dovrei essere una risposta"
    };

    await brain.process(ctx4);
    console.log("Risposta ottenuta:", ctx4.response);

    if (ctx4.response === null && ctx4.responseBlocked === true) {
        console.log("✅ TEST 4 PASSED: Risposta automatica bloccata.\n");
    } else {
        console.error("❌ TEST 4 FAILED: La chat non è stata taciuta!");
        process.exit(1);
    }

    // TEST 5: Comando "start onofrius"
    console.log("--- TEST 5: Comando 'start onofrius' ---");
    let ctx5 = {
        chatId: testChatId,
        senderId: testChatId,
        sender: { name: "TestUser" },
        text: "start onofrius"
    };

    await brain.process(ctx5);
    console.log("Risposta ottenuta:\n" + ctx5.response);

    if (ctx5.response && ctx5.response.includes("Sistema ONOFRIUS riattivato in questa chat")) {
        console.log("✅ TEST 5 PASSED: Chat riattivata correttamente.\n");
    } else {
        console.error("❌ TEST 5 FAILED: Risposta di riattivazione non corretta!");
        process.exit(1);
    }

    // TEST 6: Messaggio dopo riattivazione
    console.log("--- TEST 6: Messaggio normale dopo riattivazione ---");
    let ctx6 = {
        chatId: testChatId,
        senderId: testChatId,
        sender: { name: "TestUser" },
        text: "Sei tornato?",
        response: "Sono di nuovo operativo."
    };

    await brain.process(ctx6);
    console.log("Risposta ottenuta:\n" + ctx6.response);

    if (ctx6.response === "Sono di nuovo operativo.") {
        console.log("✅ TEST 6 PASSED: ONOFRIUS risponde normalmente dopo la riattivazione.\n");
    } else {
        console.error("❌ TEST 6 FAILED: Risposta post-riattivazione errata!");
        process.exit(1);
    }

    // Pulizia
    chatControl.seenChats.delete(testChatId);
    chatControl.mutedChats.delete(testChatId);
    chatControl.saveState();

    console.log("🎉 ALL CHAT CONTROL TESTS PASSED SUCCESSFULLY!");
}

runTest();
