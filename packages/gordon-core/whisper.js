const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const MAX_ATTEMPTS = 5;
const RETRY_DELAYS = [2000, 3000, 4000, 5000, 6000];

async function downloadWithRetry(msg) {
    let lastError = null;

    if (!msg) {
        console.error("❌ [Whisper] Messaggio nullo passato a downloadWithRetry");
        return null;
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(`[Whisper] 📥 Download media (tentativo ${attempt}/${MAX_ATTEMPTS})...`);

            // Prova a rinfrescare l'oggetto messaggio se il client è attivo per recuperare le chiavi di decrittazione
            let targetMsg = msg;
            if (msg.client && msg.id && msg.id._serialized && typeof msg.client.getMessageById === "function") {
                try {
                    const freshMsg = await msg.client.getMessageById(msg.id._serialized);
                    if (freshMsg) targetMsg = freshMsg;
                } catch (e) {
                    // Fallback all'oggetto msg originale
                }
            }

            const media = await targetMsg.downloadMedia();

            if (media && media.data && media.data.length > 0) {
                console.log(`[Whisper] ✅ Download media completato con successo (${media.data.length} bytes).`);
                return media;
            }

            console.log("[Whisper] ⚠️ Media vuoto o non ancora decrittografato, ritento...");
        } catch (err) {
            lastError = err;
            console.log(`[Whisper] ⚠️ Tentativo ${attempt} fallito: ${err.message || err}`);
        }

        if (attempt < MAX_ATTEMPTS) {
            const delay = RETRY_DELAYS[attempt - 1] || 3000;
            console.log(`[Whisper] ⏳ Attesa di ${delay}ms prima del prossimo tentativo...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }

    if (lastError) {
        console.error("❌ [Whisper] Download media fallito dopo", MAX_ATTEMPTS, "tentativi. Ultimo errore:", lastError.message || lastError);
    }

    return null;
}

function resolvePythonBinary() {
    const candidateVenvs = [
        path.join(__dirname, "..", ".venv", "bin", "python"),
        path.join(__dirname, "..", "..", "Gordon3", ".venv", "bin", "python"),
        "python3",
        "python"
    ];

    for (const binPath of candidateVenvs) {
        if (fs.existsSync(binPath)) {
            return binPath;
        }
    }
    return "python3";
}

function resolveTranscribeScript() {
    const candidateScripts = [
        path.join(__dirname, "..", "python", "transcribe.py"),
        path.join(__dirname, "..", "..", "Gordon3", "python", "transcribe.py")
    ];

    for (const scriptPath of candidateScripts) {
        if (fs.existsSync(scriptPath)) {
            return scriptPath;
        }
    }
    return null;
}

async function transcribe(msg) {
    console.log("\n=========================================");
    console.log("🎤 [Whisper] Inizio Trascrizione Vocale (faster-whisper)");
    console.log("=========================================");

    await new Promise(r => setTimeout(r, 2000));

    const media = await downloadWithRetry(msg);

    if (!media) {
        console.log("❌ [Whisper] Nessun media disponibile. Trascrizione saltata.");
        return { status: "error", transcript: "", segments: [] };
    }

    const archiveDir = path.join(__dirname, "..", "tmp", "voice_archive");
    if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
    }

    const fileId = Date.now().toString();
    const audioFilename = fileId + ".ogg";
    const audioFilepath = path.join(archiveDir, audioFilename);
    const transcriptFilepath = path.join(archiveDir, fileId + ".txt");

    try {
        fs.writeFileSync(audioFilepath, Buffer.from(media.data, "base64"));
        console.log(`[Whisper] 💾 File audio salvato ed archiviato: ${audioFilepath}`);
    } catch (err) {
        console.error("❌ [Whisper] Scrittura file audio fallita:", err.message);
        return { status: "error", transcript: "", segments: [] };
    }

    const pythonBin = resolvePythonBinary();
    const scriptPath = resolveTranscribeScript();

    if (!scriptPath) {
        console.error("❌ [Whisper] Script transcribe.py non trovato!");
        return { status: "error", transcript: "", segments: [] };
    }

    console.log(`[Whisper] 🐍 Esecuzione faster-whisper: ${pythonBin} ${scriptPath} ${audioFilepath}`);

    return new Promise((resolve) => {
        const python = spawn(pythonBin, [scriptPath, audioFilepath]);

        let output = "";
        let errored = false;

        python.stdout.on("data", data => {
            output += data.toString();
        });

        python.stderr.on("data", data => {
            console.error("[Whisper] Stderr:", data.toString().trim());
        });

        python.on("error", err => {
            errored = true;
            console.error("❌ [Whisper] Impossibile avviare il processo Python:", err.message);
        });

        python.on("close", (code) => {
            if (errored || code !== 0) {
                console.error(`❌ [Whisper] Trascrizione fallita (exit code ${code})`);
                resolve({ status: "error", transcript: "", segments: [] });
                return;
            }

            let parsed = null;
            try {
                parsed = JSON.parse(output.trim());
            } catch (e) {
                parsed = { status: "success", transcript: output.trim(), segments: [] };
            }

            const transcript = parsed.transcript || "";
            if (transcript) {
                fs.writeFileSync(transcriptFilepath, transcript, "utf8");
            }

            resolve({
                status: parsed.status || "success",
                transcript: transcript,
                language: parsed.language || "it",
                duration: parsed.duration || 0,
                segments: parsed.segments || [],
                originalFile: audioFilepath,
                transcriptFile: transcriptFilepath
            });
        });
    });
}

module.exports = {
    transcribe
};
