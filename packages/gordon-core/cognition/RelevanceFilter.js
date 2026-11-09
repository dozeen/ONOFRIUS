/**
 * RelevanceFilter.js - Selezionatore di Pertinenza Cognitiva per il Prompt Builder
 * 
 * Evita di contaminare i prompt con fatti o pensieri irrilevanti o del passato.
 * Seleziona solo le intenzioni e le preferenze pertinenti alle parole chiave dello stimolo.
 */

class RelevanceFilter {
    static INPUT = ["items", "inputText"];
    static OUTPUT = ["relevantItems"];

    /**
     * Filtra una lista di pensieri/intenzioni mantenendo solo quelli strettamente pertinenti al messaggio corrente.
     * Se nessuna intenzione o pensiero è attinente, restituisce lista vuota per evitare allucinazioni.
     * @param {Array} items - Lista di pensieri/intenzioni
     * @param {string} inputText - Messaggio in ingresso
     * @returns {Array} Elementi pertinenti
     */
    static filterRelevantThoughts(items, inputText = "") {
        if (!items || !Array.isArray(items) || items.length === 0) return [];
        if (!inputText || !inputText.trim()) return [];

        const lowerInput = inputText.toLowerCase();
        // Ignoriamo stop words comuni
        const stopWords = new Set(["ciao", "buongiorno", "buonasera", "buonanotte", "come", "cosa", "dove", "quando", "perche", "perché", "anche", "sono", "stai", "fare", "fai", "tutto", "bene", "male", "oggi", "ieri", "domani", "adesso", "subito", "pure", "solo"]);
        const keywords = lowerInput.split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 3 && !stopWords.has(w));

        if (keywords.length === 0) {
            return [];
        }

        const relevant = items.filter(item => {
            const itemText = (typeof item === "string" ? item : (item.content || "")).toLowerCase();
            return keywords.some(kw => itemText.includes(kw));
        });

        return relevant;
    }

    /**
     * Filtra le preferenze stabili (es. "Preferisco comunicare via email") includendole SOLO se pertinenti
     * @param {Array} items - Lista preferenze
     * @param {string} inputText - Messaggio in ingresso
     * @returns {Array} Preferenze pertinenti
     */
    static filterRelevantPreferences(items, inputText = "") {
        if (!items || !Array.isArray(items) || items.length === 0) return [];
        if (!inputText) return [];

        const lowerInput = inputText.toLowerCase();
        const keywords = lowerInput.split(/\s+/).filter(w => w.length > 2);
        const prefDomainKeywords = ["scriva", "scrivimi", "email", "mail", "comunicare", "contatto", "prefisco", "preferenza", "messaggio"];

        return items.filter(item => {
            const itemText = (typeof item === "string" ? item : (item.content || "")).toLowerCase();
            const hasDirectMatch = keywords.some(kw => itemText.includes(kw));
            const hasDomainMatch = prefDomainKeywords.some(kw => lowerInput.includes(kw));
            return hasDirectMatch || hasDomainMatch;
        });
    }
}

module.exports = RelevanceFilter;
