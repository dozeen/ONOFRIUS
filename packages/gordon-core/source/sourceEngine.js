const SourceProfile = require("./sourceProfile");
const SourceScoring = require("./sourceScoring");

class SourceEngine {

    constructor() {

        this.scoring = new SourceScoring();

    }

    build(data) {

        const source = new SourceProfile(data);

        source.weight =
            this.scoring.score(source);

        source.canonical =
            source.weight >= 90;

        return source;

    }

}

module.exports = SourceEngine;
