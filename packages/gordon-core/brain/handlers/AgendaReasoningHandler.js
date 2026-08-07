const AgendaManager = require('../../agenda/AgendaManager');

/**
 * AgendaReasoningHandler
 * Analizza le richieste relative agli appuntamenti e verifica conflitti o disponibilità usando l'AgendaManager.
 */

class AgendaReasoningHandler {
    constructor() {
        this.agendaManager = new AgendaManager();
    }

    async process(context) {
        // Simula il caricamento dell'agenda (predisposto per Google Calendar)
        if (context.agenda && context.agenda.events) {
            this.agendaManager.setEvents(context.agenda.events);
        }

        // Se l'intent corrente richiede una verifica di appuntamento o disponibilità
        const workingMemory = context.workingMemory;
        if (workingMemory && workingMemory.cognition) {
            const intent = workingMemory.cognition.intent;

            if (intent === 'schedule_appointment' || intent === 'check_availability') {
                const requestedStart = context.event.startTime || Date.now();
                const duration = context.event.durationMinutes || 60;

                const conflictResult = this.agendaManager.checkConflicts(
                    requestedStart,
                    requestedStart + (duration * 60 * 1000)
                );

                if (conflictResult.hasConflict) {
                    workingMemory.addThreat('Conflitto di orario in agenda', 'high');
                    
                    // Calcola slot alternativi basati sul profilo utente
                    const userProfile = context.identity?.type || 'default';
                    const availableSlots = this.agendaManager.findAvailableSlots(
                        requestedStart, 
                        duration, 
                        userProfile
                    );

                    workingMemory.agenda.conflictCount = conflictResult.conflicts.length;
                    workingMemory.agenda.alternativeSlots = availableSlots;
                }
            }
        }

        return context;
    }
}

module.exports = AgendaReasoningHandler;
