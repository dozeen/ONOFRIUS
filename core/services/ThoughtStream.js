const Registry = require("./ServiceRegistry");

class NullThoughtStream {

    getInnerWorld() {

        return {

            intentions: [],
            thoughts: []

        };

    }

}

module.exports = Registry.resolve("ThoughtStream") || new NullThoughtStream();
