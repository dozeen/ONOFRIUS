/**
 * CognitiveProfiler.js - Misuratore di Prestazioni e Profiler Cognitivo per Gordon 3
 */

class CognitiveProfiler {
    constructor() {
        this.timers = new Map();
        this.records = new Map();
        this.startTime = null;
    }

    startTotal() {
        this.startTime = process.hrtime();
    }

    start(stageName) {
        this.timers.set(stageName, process.hrtime());
    }

    end(stageName) {
        const start = this.timers.get(stageName);
        if (start) {
            const diff = process.hrtime(start);
            const ms = Math.round((diff[0] * 1000) + (diff[1] / 1000000));
            this.records.set(stageName, ms);
        }
    }

    formatSummary() {
        let totalMs = 0;
        if (this.startTime) {
            const diff = process.hrtime(this.startTime);
            totalMs = Math.round((diff[0] * 1000) + (diff[1] / 1000000));
        }

        let output = "\n──────── Cognitive Profile ────────\n";
        const stages = [
            { key: "Perception", label: "Perception" },
            { key: "FactEngine", label: "Fact Engine" },
            { key: "Thought", label: "Thought" },
            { key: "Attention", label: "Attention" },
            { key: "Interaction", label: "Interaction" },
            { key: "Prompt", label: "Prompt" },
            { key: "LLM", label: "LLM" },
            { key: "Verifier", label: "Verifier" },
            { key: "Dispatch", label: "Dispatch" }
        ];

        for (const stage of stages) {
            const ms = this.records.get(stage.key) || 0;
            const labelStr = stage.label.padEnd(16, ".");
            const msStr = `${ms} ms`.padStart(7, " ");
            output += `${labelStr} ${msStr}\n`;
        }

        const totalLabel = "TOTAL".padEnd(16, ".");
        const totalMsStr = `${totalMs} ms`.padStart(7, " ");
        output += `${totalLabel} ${totalMsStr}\n`;
        output += "───────────────────────────────────\n";

        return output;
    }
}

module.exports = CognitiveProfiler;
