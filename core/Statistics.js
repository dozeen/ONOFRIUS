class Statistics {

    constructor() {

        this.startedAt = Date.now();

        this.totalEvents = 0;

        this.eventsByType = {};

        this.errors = 0;

        this.warnings = 0;

        this.lastEvent = null;

    }

    event(event) {

        this.totalEvents++;

        this.lastEvent = event.type;

        this.eventsByType[event.type] ??= 0;

        this.eventsByType[event.type]++;

    }

    warning() {

        this.warnings++;

    }

    error() {

        this.errors++;

    }

    uptime() {

        return Math.floor((Date.now() - this.startedAt) / 1000);

    }

    snapshot() {

        return {

            uptime: this.uptime(),

            totalEvents: this.totalEvents,

            eventsByType: this.eventsByType,

            warnings: this.warnings,

            errors: this.errors,

            lastEvent: this.lastEvent

        };

    }

}

module.exports = new Statistics();
