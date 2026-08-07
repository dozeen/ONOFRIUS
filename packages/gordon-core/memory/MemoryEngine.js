class MemoryEngine {

    static async store(message) {

        console.log("🧠 Memory Engine");

        console.dir(message, { depth: null });

        return "✔ Ricordo salvato (test).";

    }

}

module.exports = MemoryEngine;
