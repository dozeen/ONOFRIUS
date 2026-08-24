/**
 * OwnerProfile.js - Centralized Accessor for Owner Identity Configuration in packages/gordon-core
 */

let ConfigManager = null;
try {
    ConfigManager = require("../../core/config/ConfigManager");
} catch (e) {
    try {
        ConfigManager = require("../config/ConfigManager");
    } catch (e2) {}
}

class OwnerProfile {
    static get() {
        if (ConfigManager && typeof ConfigManager.owner === "function") {
            return ConfigManager.owner();
        }
        return {
            name: "Owner",
            aliases: ["owner", "me"],
            confidentialSubjects: [],
            familyMembers: []
        };
    }
}

module.exports = OwnerProfile;
