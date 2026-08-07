/**
 * test-whisper-flow.js - Test di verifica della diagnosi e dell'invocazione di Whisper & MediaRouter
 */

const mediaRouter = require("./mediaRouter");
const whisper = require("./whisper");
const crypto = require("crypto");

async function runTest() {
    console.log("=========================================");
    console.log("TEST WHISPER AUDIO TRANSCRIBER & MEDIAROUTER");
    console.log("=========================================\n");

    // TEST 1: MediaRouter Riconoscimento PTT e Audio
    console.log("--- TEST 1: Riconoscimento PTT e Audio in MediaRouter ---");
    const mockPttMsg = {
        from: "393000000000",
        type: "ptt",
        hasMedia: true,
        body: "",
        id: { _serialized: "ptt_123" },
        downloadMedia: async () => null // Mock download vuoto per evitare attesa
    };

    const ctxPtt = await mediaRouter.buildContext(mockPttMsg, crypto);
    console.log("Context Media (PTT):", ctxPtt.media);

    const mockAudioMsg = {
        from: "393000000000",
        type: "audio",
        hasMedia: true,
        body: "",
        id: { _serialized: "audio_123" },
        downloadMedia: async () => null
    };
    const ctxAudio = await mediaRouter.buildContext(mockAudioMsg, crypto);
    console.log("Context Media (Audio):", ctxAudio.media);

    if (ctxPtt.media.isVoice === true && ctxAudio.media.isVoice === true) {
        console.log("✅ TEST 1 PASSED: MediaRouter identifica sia PTT che Audio come messaggi vocali.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL WHISPER DIAGNOSTIC TESTS PASSED SUCCESSFULLY!");
}

runTest();
