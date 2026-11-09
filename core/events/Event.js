const crypto = require("crypto");

class Event {

    constructor(data = {}) {

        this.id = data.id || crypto.randomUUID();

        this.timestamp = data.timestamp || new Date().toISOString();

        this.source = data.source;

        this.actor = data.actor;

        this.direction = data.direction;

        this.kind = data.kind;

        this.payload = data.payload || {};

        this.metadata = data.metadata || {};

        this.causedBy = data.causedBy || null;

        this.correlationId = data.correlationId || this.id;
this.parentId = data.parentId || null;

this.tags = data.tags || [];

    }

}

module.exports = Event;
