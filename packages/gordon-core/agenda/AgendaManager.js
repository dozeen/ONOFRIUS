/**
 * AgendaManager
 * Gestisce i conflitti di calendario, i vincoli temporali e il calcolo della disponibilità.
 */

class AgendaManager {
    constructor() {
        this.events = [];
    }

    /**
     * Imposta o aggiorna gli eventi in agenda
     */
    setEvents(events) {
        this.events = events || [];
    }

    /**
     * Aggiunge un evento all'agenda
     */
    addEvent(event) {
        this.events.push(event);
    }

    /**
     * Verifica la presenza di conflitti per un intervallo temporale proposto
     */
    checkConflicts(startTime, endTime) {
        const conflicts = [];
        
        for (const event of this.events) {
            // Verifica sovrapposizione temporale
            if (startTime < event.endTime && endTime > event.startTime) {
                conflicts.push(event);
            }
        }

        return {
            hasConflict: conflicts.length > 0,
            conflicts
        };
    }

    /**
     * Trova slot liberi in base alla durata richiesta e al profilo utente
     */
    findAvailableSlots(requestedDate, durationMinutes = 60, userProfile = 'default') {
        // Filtra eventi per la giornata richiesta
        const dayEvents = this.events.filter(e => {
            const eventDate = new Date(e.startTime).toDateString();
            return eventDate === new Date(requestedDate).toDateString();
        });

        // Ordina gli eventi per ora di inizio
        dayEvents.sort((a, b) => a.startTime - b.startTime);

        const slots = [];
        // Orari lavorativi standard o flessibili in base al profilo
        const startHour = userProfile === 'family' ? 8 : 9;
        const endHour = userProfile === 'family' ? 21 : 18;

        let cursor = new Date(requestedDate);
        cursor.setHours(startHour, 0, 0, 0);

        const dayEnd = new Date(requestedDate);
        dayEnd.setHours(endHour, 0, 0, 0);

        for (const event of dayEvents) {
            const eventStart = new Date(event.startTime);
            const eventEnd = new Date(event.endTime);

            if (cursor < eventStart) {
                const diffMinutes = (eventStart - cursor) / (1000 * 60);
                if (diffMinutes >= durationMinutes) {
                    slots.push({
                        startTime: new Date(cursor),
                        endTime: new Date(eventStart)
                    });
                }
            }
            if (cursor < eventEnd) {
                cursor = new Date(eventEnd);
            }
        }

        if (cursor < dayEnd) {
            const diffMinutes = (dayEnd - cursor) / (1000 * 60);
            if (diffMinutes >= durationMinutes) {
                slots.push({
                    startTime: new Date(cursor),
                    endTime: new Date(dayEnd)
                });
            }
        }

        return slots;
    }
}

module.exports = AgendaManager;
