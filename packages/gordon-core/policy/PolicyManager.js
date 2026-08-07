const store = require("./PolicyStore");
const Modes = require("./PolicyModes");

class PolicyManager {

    constructor() {

        this.reload();

    }

    reload() {

        this.policies = store.load();

    }

    save() {

        store.save(this.policies);

    }

    get(type, identity) {

        if (!identity)
            return this.policies.global;

        if (!this.policies[type])
            return { mode: Modes.ON };

        return this.policies[type][identity] || {
            mode: Modes.ON
        };

    }

    set(type, identity, mode) {

        if (!this.policies[type])
            this.policies[type] = {};

        this.policies[type][identity] = {

            mode

        };

        this.save();

    }

    remove(type, identity) {

        if (this.policies[type])
            delete this.policies[type][identity];

        this.save();

    }

    canReply(type, identity) {

        return this.get(type, identity).mode === Modes.ON;

    }

    canObserve(type, identity) {

        return this.get(type, identity).mode !== Modes.OFF;

    }

    canLearn(type, identity) {

        return this.get(type, identity).mode !== Modes.OFF;

    }

    list() {

        return this.policies;

    }

}

module.exports = new PolicyManager();
