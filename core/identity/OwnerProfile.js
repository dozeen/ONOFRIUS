/**
 * OwnerProfile.js - Centralized Accessor for Owner Identity Configuration
 * 
 * Provides safe, fall-through access to the owner's identity configuration.
 * Fallback order: config/owner.json -> config/owner.example.json -> templates/owner.example.json -> default object.
 */

const fs = require("fs");
const path = require("path");

class OwnerProfile {
    static get() {
        const rootDir = path.resolve(__dirname, "../../");
        const userConfigPath = path.join(rootDir, "config", "owner.json");
        const exampleConfigPath = path.join(rootDir, "config", "owner.example.json");
        const templateConfigPath = path.join(rootDir, "templates", "owner.example.json");

        let data = null;

        if (fs.existsSync(userConfigPath)) {
            try {
                data = JSON.parse(fs.readFileSync(userConfigPath, "utf8"));
            } catch (e) {}
        }

        if (!data && fs.existsSync(exampleConfigPath)) {
            try {
                data = JSON.parse(fs.readFileSync(exampleConfigPath, "utf8"));
            } catch (e) {}
        }

        if (!data && fs.existsSync(templateConfigPath)) {
            try {
                data = JSON.parse(fs.readFileSync(templateConfigPath, "utf8"));
            } catch (e) {}
        }

        if (!data) {
            data = {
                name: "Owner",
                nickname: "Me",
                aliases: ["owner", "me"],
                language: "en",
                timezone: "Europe/Rome",
                familyMembers: [],
                trustedContacts: [],
                confidentialSubjects: []
            };
        }

        data.name = data.name || "Owner";
        data.aliases = Array.isArray(data.aliases) ? data.aliases : ["owner", "me"];
        data.familyMembers = Array.isArray(data.familyMembers) ? data.familyMembers : [];
        data.trustedContacts = Array.isArray(data.trustedContacts) ? data.trustedContacts : [];
        data.confidentialSubjects = Array.isArray(data.confidentialSubjects) ? data.confidentialSubjects : [];

        return data;
    }
}

module.exports = OwnerProfile;
