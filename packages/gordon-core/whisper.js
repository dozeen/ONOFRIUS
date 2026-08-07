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
    console.log("🎤 [Whisper] Inizio Trascrizione Vocale");
    console.log("=========================================");
    console.log("[Whisper] Type:", msg.type, "| HasMedia:", msg.hasMedia);

    // Aspetta la sincronizzazione del messaggio
    await new Promise(r => setTimeout(r, 1500));

    const media = await downloadWithRetry(msg);

    if (!media) {
        console.log("❌ [Whisper] Nessun media disponibile. Trascrizione saltata.");
        return "";
    }

    const voiceDir = path.join(__dirname, "..", "tmp", "voice");
    if (!fs.existsSync(voiceDir)) {
        fs.mkdirSync(voiceDir, { recursive: true });
    }

    const filename = Date.now() + ".ogg";
    const filepath = path.join(voiceDir, filename);

    try {
        fs.writeFileSync(filepath, Buffer.from(media.data, "base64"));
        console.log(`[Whisper] 💾 File audio salvato temporaneamente: ${filepath}`);
    } catch (err) {
        console.error("❌ [Whisper] Scrittura file audio fallita:", err.message);
        return "";
    }

    const pythonBin = resolvePythonBinary();
    const scriptPath = resolveTranscribeScript();

    if (!scriptPath) {
        console.error("❌ [Whisper] Script transcribe.py non trovato!");
        fs.unlink(filepath, () => {});
        return "";
    }

    console.log(`[Whisper] 🐍 Esecuzione Python: ${pythonBin} ${scriptPath} ${filepath}`);

    return new Promise((resolve) => {
        const python = spawn(pythonBin, [scriptPath, filepath]);

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
            fs.unlink(filepath, () => {});

            if (errored || code !== 0) {
                console.error(`❌ [Whisper] Trascrizione fallita (exit code ${code})`);
                resolve("");
                return;
            }

            const transcribedText = output.trim();
            console.log("📝 [Whisper] Trascrizione completata con successo:");
            console.log(`"${transcribedText}"`);
            console.log("=========================================\n");
            resolve(transcribedText);
        });
    });
}

module.exports = {
    transcribe
};
