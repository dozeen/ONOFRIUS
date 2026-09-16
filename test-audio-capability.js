/**
 * test-audio-capability.js - Test di verifica dell'AudioCapability in ONOFRIUS
 */

const AudioCapability = require("./packages/gordon-core/capability/AudioCapability");

function generateSilenceWav(durationSec = 0.5, sampleRate = 16000) {
    const numSamples = Math.floor(sampleRate * durationSec);
    const dataSize = numSamples * 2;
    const buffer = Buffer.alloc(44 + dataSize);
    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write("WAVE", 8);
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(1, 22); // mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(dataSize, 40);
    return buffer.toString("base64");
}

async function runTest() {
    console.log("=========================================");
    console.log("TEST AUDIOCAPABILITY & FASTER-WHISPER");
    console.log("=========================================\n");

    const mockPttMsg = {
        type: "ptt",
        hasMedia: true,
        downloadMedia: async () => ({
            data: generateSilenceWav(0.5, 16000)
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
