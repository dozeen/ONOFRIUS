const RelationshipStore =
    require("../relationships/relationshipStore");

class ContactLearning {

    update(phone, profile) {

        RelationshipStore.save(phone, {

            relationship: profile.relationship,

            confidence: profile.confidence,

            updatedAt: new Date().toISOString()

        });

    }

}

module.exports = ContactLearning;
