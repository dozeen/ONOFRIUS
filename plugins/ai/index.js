const ai = require("../../core/ai");
const promptBuilder = require("../../core/promptBuilder");

let AgendaCapability = null;
try {
    AgendaCapability = require("../../core/capability/AgendaCapability");
} catch (e) {
    try {
        AgendaCapability = require("../../packages/gordon-core/capability/AgendaCapability");
    } catch (e2) {
        AgendaCapability = { isAgendaQuery: () => false };
    }
}

module.exports = {
    name: "AI",
    priority: 0,

    async canHandle() {
        return true;
    },

    async handle(context) {
        try {
            const text = context.text || (context.event && context.event.text) || "";

            // Intercettazione deterministica di comandi di sistema prima dell'LLM (0 Token LLM)
            const CommandEngine = require("../../core/commands/CommandEngine");
            if (CommandEngine.isCommand && CommandEngine.isCommand(text)) {
                const cmdRes = await CommandEngine.execute(text, context);
                if (cmdRes && cmdRes.handled) {
                    console.log("⚡ [AI Plugin] Intercettazione deterministica comando eseguita (0 Token LLM)");
                    return cmdRes.reply;
                }
            }

            // Intercettazione deterministica dell'agenda prima dell'LLM (sia da CLI che da adattatori)
            if (AgendaCapability && typeof AgendaCapability.isAgendaQuery === "function" && AgendaCapability.isAgendaQuery(text)) {
                const agendaRes = await AgendaCapability.execute(context);
                if (agendaRes && agendaRes.handled) {
                    console.log("📅 [AI Plugin] Intercettazione deterministica agenda eseguita (0 Token LLM)");
                    return agendaRes.reply;
                }
            }

            if (context.profiler) context.profiler.start("Prompt");

            const prompt = promptBuilder.build(context);
            context.prompt = prompt;
            context.promptLength = prompt ? prompt.length : 0;

            if (context.profiler) context.profiler.end("Prompt");

            console.log("\n========== PROMPT ==========");
            console.log(prompt);
            console.log("============================\n");
            console.log("✅ PromptBuilder OK");

            if (context.profiler) context.profiler.start("LLM");

            const response = await ai.ask(prompt);

            console.log("LLM RAW =", response);
            console.log("LLM TYPE =", typeof response);
            console.log("LLM LENGTH =", response?.length);

            if (context.profiler) context.profiler.end("LLM");

            console.log("✅ AI OK");
            return response;
        } catch (err) {
            console.error("❌ AI Plugin Error");
            console.error(err);
            throw err;
        }
    }
};
