const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

async function downloadWithRetry(msg) {
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(`[Whisper] 📥 Download media (tentativo ${attempt}/${MAX_ATTEMPTS})...`);
            const media = await msg.downloadMedia();

            if (media) {
                console.log("[Whisper] ✅ Download media completato con successo.");
                return media;
            }

            console.log("[Whisper] ⚠️ Media vuoto, ritento...");
        } catch (err) {
            lastError = err;
            console.log(`[Whisper] ⚠️ Tentativo ${attempt} fallito: ${err.message || err}`);
        }

        if (attempt < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
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
        "/home/onofrio/Gordon3/.venv/bin/python",
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
        path.join(__dirname, "..", "..", "Gordon3", "python", "transcribe.py"),
        "/home/onofrio/Gordon3/python/transcribe.py",
        "/home/onofrio/ONOFRIUS/python/transcribe.py"
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

    await new Promise(r => setTimeout(r, 1500));

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
