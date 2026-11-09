class AgendaReasoner {

    analyze(message, agenda) {

        return {

            hasConflict: false,

            requestedDate: null,

            requestedTime: null,

            conflictingEvent: null,

            suggestion: null

        };

    }

}

module.exports = AgendaReasoner;

