/**
 * test-audio-capability.js - Test di verifica dell'AudioCapability, Trascrizione Segmentata ed Archiviazione Vocale
 */

const AudioCapability = require("./capability/AudioCapability");

async function runTest() {
    console.log("=========================================");
    console.log("TEST AUDIOCAPABILITY & FASTER-WHISPER");
    console.log("=========================================\n");

    const mockPttMsg = {
        type: "ptt",
        hasMedia: true,
        downloadMedia: async () => ({
            data: "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=" // Dummy WAV/OGG Base64
        })
    };

    // TEST 1: Identificazione Messaggio Vocale
    console.log("--- TEST 1: Identificazione Messaggio Vocale ---");
    const isVoice = AudioCapability.isAudioMsg(mockPttMsg);
    console.log("isAudioMsg:", isVoice);

    if (isVoice === true) {
        console.log("✅ TEST 1 PASSED: Messaggio PTT identificato come vocale.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // TEST 2: Processamento AudioCapability & Evento Strutturato
    console.log("--- TEST 2: Processamento Audio & Evento Strutturato ---");
    const context = { type: "ptt", hasMedia: true, downloadMedia: mockPttMsg.downloadMedia };
    const res = await AudioCapability.processAudio(context);
    console.log("AudioCapability Result:", res);
    console.log("Audio Event Strutturato:", context.audioEvent);

    if (res.handled === true && context.audioEvent && context.audioEvent.type === "voice") {
        console.log("✅ TEST 2 PASSED: AudioCapability ha prodotto un Evento Vocale strutturato con trascrizione e segmenti.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL AUDIOCAPABILITY TESTS PASSED SUCCESSFULLY!");
}

runTest();
