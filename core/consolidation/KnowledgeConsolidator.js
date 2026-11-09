class KnowledgeConsolidator {

    constructor() {

        this.count = 0;

    }

    async process(event) {

        this.count++;

    }

    async finish() {

        // qui in futuro verrà salvata la conoscenza

    }

    report() {

        return {

            processed: this.count

        };

    }

}

module.exports = KnowledgeConsolidator;
