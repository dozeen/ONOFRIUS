const ownerProfile = require("./profiles/ownerProfile");
const normal = require("./profiles/default");

class CharacterEngine {
    build(message) {
        let profile = ownerProfile;

        if (message.contact?.personality === "formal") {
            profile = normal;
        }

        return profile;
    }
}

module.exports = new CharacterEngine();
