/**
 * OwnerProfile.js - Centralized Accessor for Owner Identity Configuration
 * Delegates to ConfigManager.owner()
 */

const ConfigManager = require("../config/ConfigManager");

class OwnerProfile {
    static get() {
        return ConfigManager.owner();
    }
}

module.exports = OwnerProfile;
