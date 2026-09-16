const ownerProfile = require("./profiles/default");

class CharacterEngine {
    build(message) {
        return ownerProfile;
    }
}

module.exports = new CharacterEngine();
