class SourceProfile {

    constructor(data = {}) {

        this.type = data.type || "unknown";

        this.author = data.author || "";

        this.confidence = data.confidence ?? 1.0;

        this.weight = data.weight ?? 50;

        this.canonical = data.canonical ?? false;

    }

}

module.exports = SourceProfile;
