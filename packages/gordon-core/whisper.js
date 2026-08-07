const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

async function downloadWithRetry(msg) {
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(`DOWNLOAD... (tentativo ${attempt}/${MAX_ATTEMPTS})`);
            const media = await msg.downloadMedia();

            if (media) {
                console.log("MEDIA OK");
                return media;
            }

            console.log("MEDIA vuoto, ritento...");
        } catch (err) {
            lastError = err;
            console.log(`Tentativo ${attempt} fallito: ${err.message || err}`);
        }

        if (attempt < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
        }
    }

    if (lastError) {
        console.error("❌ Download media fallito dopo", MAX_ATTEMPTS, "tentativi");
        console.error("Ultimo errore:", lastError.message || lastError);
    }

    return null;
}

async function transcribe(msg) {
    console.log("");
    console.log("🎤 Whisper Audio Transcriber");
    console.log("");
    console.log("type:", msg.type);
    console.log("hasMedia:", msg.hasMedia);

    // aspetta che il messaggio sia sincronizzato lato WhatsApp
    await new Promise(r => setTimeout(r, 1500));

    const media = await downloadWithRetry(msg);

    if (!media) {
        console.log("media: false — trascrizione saltata, nessun crash");
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
    } catch (err) {
        console.error("❌ Scrittura file audio fallita:", err.message);
        return "";
    }

    return new Promise((resolve) => {
        const python = spawn(
            path.join(__dirname, "..", ".venv", "bin", "python"),
            [path.join(__dirname, "..", "python", "transcribe.py"), filepath]
        );

        let output = "";
        let errored = false;

        python.stdout.on("data", data => {
            output += data.toString();
        });

        python.stderr.on("data", data => {
            console.error("Whisper stderr:", data.toString());
        });

        python.on("error", err => {
            errored = true;
            console.error("❌ Impossibile avviare il processo Python:", err.message);
        });

        python.on("close", (code) => {
            fs.unlink(filepath, () => {});

            if (errored || code !== 0) {
                console.error(`❌ Trascrizione fallita (exit code ${code})`);
                resolve("");
                return;
            }

            console.log("");
            console.log("📝 Trascrizione Audio Completata:");
            console.log(output.trim());
            console.log("");
            resolve(output.trim());
        });
    });
}

module.exports = {
    transcribe
};
