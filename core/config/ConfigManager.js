/**
 * ConfigManager.js - Centralized Unified Configuration Gateway for ONOFRIUS
 * 
 * Provides transparent, safe access to configuration resources:
 * Pipeline: config/*.json -> config/*.example.json -> templates/*.example.json -> default object
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../../");

const DEFAULT_CONFIGS = {
    owner: {
        name: "Owner",
        nickname: "Me",
        aliases: ["owner", "me"],
        language: "en",
        timezone: "Europe/Rome",
        familyMembers: [],
        trustedContacts: [],
        confidentialSubjects: []
    },
    contacts: {
        default: {
            name: "Contact Name",
            personality: "normal",
            type: "standard"
        }
    },
    identities: {
        owner: {
            role: "owner",
            displayName: "Owner"
        }
    },
    settings: {
        logLevel: "INFO",
        debug: false,
        memoryPath: "./memory"
    },
    groupPolicy: {
        enabled: true,
        groups: {
            passive: true
        }
    }
};

class ConfigManager {
    static load(name) {
        const userPath = path.join(ROOT_DIR, "config", `${name}.json`);
        const examplePath = path.join(ROOT_DIR, "config", `${name}.example.json`);
        const templatePath = path.join(ROOT_DIR, "templates", `${name}.example.json`);

        let data = null;

        if (fs.existsSync(userPath)) {
            try {
                data = JSON.parse(fs.readFileSync(userPath, "utf8"));
            } catch (e) {}
        }

        if (!data && fs.existsSync(examplePath)) {
            try {
                data = JSON.parse(fs.readFileSync(examplePath, "utf8"));
            } catch (e) {}
        }

        if (!data && fs.existsSync(templatePath)) {
            try {
                data = JSON.parse(fs.readFileSync(templatePath, "utf8"));
            } catch (e) {}
        }

        if (!data) {
            data = DEFAULT_CONFIGS[name] || {};
        }

        return data;
    }

    static owner() {
        const data = ConfigManager.load("owner");
        data.name = data.name || "Owner";
        data.aliases = Array.isArray(data.aliases) ? data.aliases : ["owner", "me"];
        data.familyMembers = Array.isArray(data.familyMembers) ? data.familyMembers : [];
        data.trustedContacts = Array.isArray(data.trustedContacts) ? data.trustedContacts : [];
        data.confidentialSubjects = Array.isArray(data.confidentialSubjects) ? data.confidentialSubjects : [];
        return data;
    }

    static contacts() {
        const data = ConfigManager.load("contacts");
        if (!data.default) {
            data.default = { name: "Contact Name", personality: "normal", type: "standard" };
        }
        return data;
    }

    static identities() {
        return ConfigManager.load("identities");
    }

    static settings() {
        return ConfigManager.load("settings");
    }

    static groupPolicy() {
        return ConfigManager.load("groupPolicy");
    }
}

module.exports = ConfigManager;
