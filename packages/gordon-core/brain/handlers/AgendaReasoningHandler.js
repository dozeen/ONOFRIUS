const AgendaManager = require('../../agenda/AgendaManager');

/**
 * AgendaReasoningHandler
 * Analizza le richieste relative agli appuntamenti e verifica conflitti o disponibilità usando l'AgendaManager.
 * Rispettoso della volontà dell'Owner ISOLATA PER SINGOLA CHAT (Per-Chat Owner Will & Appointment Constraints).
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

        const text = (context.text || (context.event && context.event.text) || "").toLowerCase();
        const workingMemory = context.workingMemory;
        const contactName = context.contactName || (context.contact && context.contact.name) || "Interlocutore";

        // Estrae le decisioni espresse dall'Owner SPECIFICATAMENTE NELLA STORIA DI QUESTA CHAT
        let chatSpecificDecision = null;

        const dayRegex = /(lunedì|lunedí|lunedi|martedì|martedi|mercoledì|mercoledi|giovedì|giovedi|venerdì|venerdi|sabato|domenica|domani|oggi|stasera|stassera)(\s+(alle|ora|ore)\s+\d{1,2}(:\d{2})?)?/i;

        if (context.history && Array.isArray(context.history)) {
            // Scansiona la storia recente di QUESTA specifica chat dal messaggio più recente
            for (let i = context.history.length - 1; i >= 0; i--) {
                const msg = context.history[i];
                if (msg.fromMe || msg.role === 'assistant' || msg.isOwner) {
                    const msgText = (msg.text || "").toLowerCase();
                    const match = msgText.match(dayRegex);

                    if (match) {
                        chatSpecificDecision = match[0].trim();
                        break; // Trovata la decisione più recente per QUESTA chat
                    }
                }
            }
        }

        // Se nella storia di QUESTA chat non c'era, controlla se era passata come nota/fatto isolato
        if (!chatSpecificDecision && context.facts && Array.isArray(context.facts)) {
            for (const f of context.facts) {
                const fText = (typeof f === 'string' ? f : (f.statement || "")).toLowerCase();
                const match = fText.match(dayRegex);
                if (match) {
                    chatSpecificDecision = match[0].trim();
                    break;
                }
            }
        }

        // Se per QUESTA CHAT L'Owner ha stabilito un momento preciso
        if (chatSpecificDecision) {
            // Normalizza maiuscola iniziale per il prompt (es. giovedì -> Giovedì)
            const formattedDecision = chatSpecificDecision.charAt(0).toUpperCase() + chatSpecificDecision.slice(1);
            const decisionLower = chatSpecificDecision.toLowerCase();
            
            // Verifica se l'interlocutore in QUESTA CHAT sta chiedendo un cambio/anticipo che contrasta con la decisione
            const isConflictingRequest = (
                (text.includes("domani") && !decisionLower.includes("domani")) ||
                (text.includes("oggi") && !decisionLower.includes("oggi")) ||
                (text.includes("stasera") && !decisionLower.includes("stasera")) ||
                (text.includes("prima") || text.includes("invece") || text.includes("cambiare") || text.includes("spostare") || text.includes("anticipare"))
            );

            if (!context.agendaContext) {
                context.agendaContext = {};
            }
            if (!context.agendaContext.relevantEvents) {
                context.agendaContext.relevantEvents = [];
            }

            // Inietta la direttiva vincolante isolata per QUESTA CHAT
            context.agendaContext.relevantEvents.push({
                title: `DECISIONE SPECIFICA PER CHAT DI ${contactName.toUpperCase()}: L'Owner ha stabilito '${formattedDecision}'. NON accettare cambi o anticipi e conferma '${formattedDecision}'.`,
                date: formattedDecision
            });

            if (isConflictingRequest && workingMemory && workingMemory.addThreat) {
                workingMemory.addThreat(`Tentativo di modifica appuntamento in conflitto con la decisione specifica per ${contactName} ('${formattedDecision}')`, 'high');
            }
        }

        // Se l'intent corrente richiede una verifica generale di appuntamento o disponibilità
        if (workingMemory && workingMemory.cognition) {
            const intent = workingMemory.cognition.intent;

            if (intent === 'schedule_appointment' || intent === 'check_availability') {
                const requestedStart = context.event ? (context.event.startTime || Date.now()) : Date.now();
                const duration = context.event ? (context.event.durationMinutes || 60) : 60;

                const conflictResult = this.agendaManager.checkConflicts(
                    requestedStart,
                    requestedStart + (duration * 60 * 1000)
                );

                if (conflictResult.hasConflict) {
                    workingMemory.addThreat('Conflitto di orario in agenda', 'high');
                    
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
