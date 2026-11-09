class Identity {

    constructor(data = {}) {

        this.id = data.id;
        this.displayName = data.displayName;
        this.aliases = data.aliases || [];
        this.contact = data.contact || null;
        this.groups = data.groups || [];

    }

}

module.exports = Identity;
