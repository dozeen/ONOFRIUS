/**
 * test-audio-capability.js - Test di verifica dell'AudioCapability in ONOFRIUS
 */

const AudioCapability = require("./packages/gordon-core/capability/AudioCapability");

async function runTest() {
    console.log("=========================================");
    console.log("TEST AUDIOCAPABILITY & FASTER-WHISPER");
    console.log("=========================================\n");

    const mockPttMsg = {
        type: "ptt",
        hasMedia: true,
        downloadMedia: async () => ({
            data: "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
        })
    };

    const isVoice = AudioCapability.isAudioMsg(mockPttMsg);
    console.log("isAudioMsg:", isVoice);

    if (isVoice === true) {
        console.log("✅ TEST 1 PASSED: Messaggio PTT identificato come vocale.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    const context = { type: "ptt", hasMedia: true, downloadMedia: mockPttMsg.downloadMedia };
    const res = await AudioCapability.processAudio(context);
    console.log("AudioCapability Result:", res);
    console.log("Audio Event Strutturato:", context.audioEvent);

    if (res.handled === true && context.audioEvent && context.audioEvent.type === "voice") {
        console.log("✅ TEST 2 PASSED: AudioCapability ha prodotto un Evento Vocale strutturato.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL AUDIOCAPABILITY TESTS PASSED SUCCESSFULLY!");
}

runTest();
