const onofrio = require("./profiles/onofrio");
const normal = require("./profiles/default");

class CharacterEngine {

    build(message) {

        let profile = onofrio;

        if (message.contact?.personality === "formal") {
            profile = normal;
        }

        return profile;

    }

}

module.exports = new CharacterEngine();
