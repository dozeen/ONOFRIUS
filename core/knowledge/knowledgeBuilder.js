const KnowledgeStore = require("./knowledgeStore");
const PersonProfile = require("./personProfile");
const FactExtractor = require("./factExtractor");

class KnowledgeBuilder {

    constructor() {

        this.store = new KnowledgeStore();

        this.extractor = new FactExtractor();

    }

    async update(name, messages) {

        let profile =
            await this.store.load(name);

        if (!profile)
            profile = new PersonProfile(name);

        const facts =
            this.extractor.extract(messages);

        for (const fact of facts) {

            if (!profile.facts.includes(fact))
                profile.facts.push(fact);

        }

        profile.last_update =
            new Date().toISOString();

        await this.store.save(profile);

        return profile;

    }

}

module.exports = KnowledgeBuilder;
