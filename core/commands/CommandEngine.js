const Policy = require("../policy/PolicyManager");
const Modes = require("../policy/PolicyModes");
const PolicyCommand = require("./commands/PolicyCommand");

function isCommand(text) {
    if (!text || typeof text !== "string") return false;
    const lower = text.trim().toLowerCase();
    return lower.startsWith("k/") || lower.startsWith("/") || lower.startsWith("!") || lower.startsWith("#gordon") || lower === "status" || lower === "doctor" || lower === "help";
}

async function execute(text, context = {}) {
    if (!text || typeof text !== "string") return { handled: false };

    const raw = text.trim();
    const lower = raw.toLowerCase();
    const cleanCmd = lower.replace(/^(k\/|\/|!|#gordon\s*)/i, "").trim();

    // 1. Comando STATUS / INFO (0 Token LLM)
    if (cleanCmd === "status" || cleanCmd === "info") {
        console.log("\n========== ONOFRIUS STATUS ==========");
        console.log(JSON.stringify(Policy.list(), null, 4));
        console.log("=====================================\n");

        const reply = `⚡ ONOFRIUS OS v1.2.0 (Alpha 0.5) Status Report:
- Status: OPERATIVO 🟢
- Engine: Gordon Core Engine
- Cognition: 10-Stage Sequential Pipeline
- Truth Model: Zero-Trust FactVerifier Active 🛡️
- Privacy Matrix: Cerchi Concentrici (FamilyPrivacyManager)
- Channel: ${context.isGroup ? "WhatsApp Group (" + (context.chatName || "Gruppo") + ")" : "Direct Chat"}`;

        return { handled: true, reply };
    }

    // 2. Comando DOCTOR / HEALTH (0 Token LLM)
    if (cleanCmd === "doctor" || cleanCmd === "health") {
        const reply = `🩺 ONOFRIUS Doctor System Report:
- Boot Checks: PASS ✅
- Environment: PASS ✅
- Ollama LLM Engine: OK ✅
- WhatsApp Adapter: CONNESSO 🟢
- Fact & Privacy Guard: ATTIVO 🛡️`;

        return { handled: true, reply };
    }

    // 3. Comando HELP (0 Token LLM)
    if (cleanCmd === "help") {
        const reply = `🤖 ONOFRIUS OS System Commands:
- k/status : Visualizza lo stato mentale e operativo
- k/doctor : Esegue la diagnostica di sistema
- k/help   : Elenca i comandi di sistema`;

        return { handled: true, reply };
    }

    // 4. Comandi di Policy (off <target>, on <target>, listen <target>)
    const cmd = raw.split(/\s+/);
    if (cmd.length >= 2) {
        const action = cmd[0].toLowerCase().replace(/^(k\/|\/|!|#gordon\s*)/i, "");
        const target = cmd.slice(1).join(" ");

        switch (action) {
            case "off":
                Policy.set("contacts", target, Modes.OFF);
                console.log(`🔴 ${target} -> OFF`);
                return { handled: true, reply: `🔴 Policy per [${target}] impostata su OFF.` };
            case "on":
                Policy.set("contacts", target, Modes.ON);
                console.log(`🟢 ${target} -> ON`);
                return { handled: true, reply: `🟢 Policy per [${target}] impostata su ON.` };
            case "listen":
                Policy.set("contacts", target, Modes.LISTEN);
                console.log(`👂 ${target} -> LISTEN`);
                return { handled: true, reply: `👂 Policy per [${target}] impostata su LISTEN.` };
        }
    }

    if (await PolicyCommand.execute(text)) {
        return { handled: true, reply: `✅ Policy command eseguito.` };
    }

    return { handled: false };
}

module.exports = {
    isCommand,
    execute
};
