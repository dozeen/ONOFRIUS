class IdentityRegistry {

    constructor() {

        this.identities = new Map();

    }

    register(identity) {

        this.identities.set(identity.id, identity);

    }

    get(id) {

        return this.identities.get(id);

    }

}

module.exports = new IdentityRegistry();
