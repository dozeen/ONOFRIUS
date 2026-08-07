<div align="center">

# ONOFRIUS

### Your Invisible Friend

**An Event-Driven Cognitive Operating System for Persistent AI Agents**

[![Website](https://img.shields.io/badge/Website-Online-00ff99?style=for-the-badge)](https://dozeen.ns0.it/onofrius/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge)]()

🌐 **Official Website:** https://dozeen.ns0.it/onofrius/

📖 [Constitution](CONSTITUTION.md) • ⭐ [GitHub Repository](https://github.com/dozeen/ONOFRIUS)

---

*"Everything begins with an Event."*

</div>

---

# What is ONOFRIUS?

ONOFRIUS is **not a chatbot**.

It is an **Event-Driven Cognitive Operating System** designed to build persistent, autonomous AI agents powered by **Gordon Core**, capable of:

- observing & passive perception (WhatsApp status broadcast, social trends, system events)
- extracting facts & fusing multi-source knowledge (Bayesian confidence boost)
- managing temporal memory decay (ephemeral vs. immutable facts)
- distinguishing certainty (*Sapere*) vs probability/beliefs (*Credere*)
- reasoning, verifying truth & maintaining zero-leak privacy

Instead of reacting to isolated prompts, ONOFRIUS continuously transforms incoming events into persistent knowledge.

> **Every Event may become Knowledge.**
>
> **Every Knowledge may improve Intelligence.**

---

# Key Principles & Constitution

ONOFRIUS follows strict architectural axioms defined in **[CONSTITUTION.md](CONSTITUTION.md)**.

### 🛡️ Principle 9: Cognitive but Not Personal
> **"ONOFRIUS è cognitivo ma non personale."**
>
> The software contains exclusively the cognitive engine, algorithms, and system logic. All personal knowledge, identities, contacts, memory, events, preferences, and user configurations are created or imported exclusively during bootstrap on the user's computer. **No personal data is ever distributed with the software.**

---

# Architecture: Standalone Runtime & Shared Gordon Core

ONOFRIUS decouples the **cognitive engine** from the **application runtime**:

```text
ONOFRIUS/
│
├── app.js               <-- Application Entrypoint
├── bootstrap/           <-- 10-step Automated Setup & Health Engine
├── cli/                 <-- Interactive Terminal & Command Interface
├── doctor/              <-- System Diagnostics
├── forge/               <-- Certified Release Builder (buildCore.js)
├── core/                <-- ONOFRIUS Kernel & Adapters
│
├── packages/
│   └── gordon-core/    <-- Certified, Standalone Gordon Core Package
│       ├── package.json
│       ├── index.js
│       ├── brain/
│       ├── cognition/
│       ├── events/
│       ├── identity/
│       └── memory/      <-- Empty runtime templates (No personal data)
│
└── package.json        <-- "dependencies": { "gordon-core": "file:packages/gordon-core" }
```

---

# Cognitive Pipeline

```text
Incoming Event (WhatsApp / CLI / System)
        │
        ▼
 Perception Engine & Passive Status Handler
        │
        ▼
 Input Classification & Attention Engine
        │
        ▼
 Working Memory & Intention Lifecycle (ACTIVE/COMPLETED/CANCELLED)
        │
        ▼
 Fact Extraction & Knowledge Fusion Engine
        │
        ▼
 Reasoning Engine & Epistemic Matrix (Sapere vs. Credere)
        │
        ▼
 Decision Engine & Selective Agenda Loading
        │
        ▼
 Relevant Preference Filter & Prompt Builder
        │
        ▼
 Zero-Trust Fact Verifier & ResponseSanitizer (Anti-Prompt-Leak & Family Privacy)
        │
        ▼
 Response / Action Execution
```

---

# Quick Start

### 1. Clone the repository
```bash
git clone git@github.com:dozeen/ONOFRIUS.git
cd ONOFRIUS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start ONOFRIUS
```bash
npm start
```
The **Bootstrap Engine** will inspect your environment (Node.js, Chrome, Ollama, Configuration), initialize WhatsApp Web, scan the QR code if required, and launch the unvarnished **ONOFRIUS Cognitive OS**.

---

# Forge Core Builder

Forge is the release certification tool. To update or re-package `gordon-core` from the development environment (`Gordon3`), run:

```bash
node forge/buildCore.js
```

### Forge Certified Build Pipeline:
- 📦 Copies the cognitive engine from `Gordon3/core` into `packages/gordon-core`.
- 🧹 **Sanitizes all personal data** (removes chat histories, contacts, personal facts & address books).
- 🔍 **Audits internal requires** to ensure 100% standalone package isolation.
- 🛡️ **Enforces Principle 9 Compliance**: Fails the build if any personal data file is detected.

---

# License

MIT License

---

<div align="center">

## ONOFRIUS

### Your Invisible Friend

**Traditional AI starts from Prompts.**

**ONOFRIUS starts from Events.**

---

*Every Event begins a Story.*

*Every Story becomes Knowledge.*

*Every Knowledge improves Intelligence.*

</div>
