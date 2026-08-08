/**
 * AudioCapability.js - Gestione Autonoma ed Archiviazione dei Messaggi Vocali
 * Trasforma i vocali in Eventi Cognitivi strutturati con Trascrizione e Segmenti Temporali.
 */

const whisper = require("../whisper");

class AudioCapability {
    static isAudioMsg(msg) {
        if (!msg) return false;
        const msgType = msg.type || (msg.media && msg.media.type) || "";
        return msgType === "ptt" || msgType === "audio" || msg.isVoice === true;
    }

    static async processAudio(context) {
        if (!this.isAudioMsg(context)) return { handled: false };

        console.log("🎤 [AudioCapability] Avvio elaborazione messaggio vocale...");

        const result = await whisper.transcribe(context);

        const transcript = typeof result === "object" ? (result.transcript || "") : (result || "");
        const segments = typeof result === "object" ? (result.segments || []) : [];
        const duration = typeof result === "object" ? (result.duration || 0) : 0;
        const language = typeof result === "object" ? (result.language || "it") : "it";

        context.text = transcript;
        context.audioEvent = {
            type: "voice",
            transcript,
            duration,
            language,
            segments,
            originalFile: typeof result === "object" ? result.originalFile : null,
            transcriptFile: typeof result === "object" ? result.transcriptFile : null
        };

        console.log(`🎤 [AudioCapability] Trascrizione completata (${duration}s, ${segments.length} segmenti): "${transcript}"`);

        return {
            handled: true,
            transcript,
            audioEvent: context.audioEvent
        };
    }
}

module.exports = AudioCapability;
