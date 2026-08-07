class Knowledge {

    constructor({

        subject,

        predicate,

        object,

        category,

        confidence,

        source,

        timestamp

    }) {

        this.subject = subject;
        this.predicate = predicate;
        this.object = object;

        this.category = category;

        this.confidence = confidence;

        this.source = source;

        this.timestamp = timestamp;

    }

}

module.exports = Knowledge;
