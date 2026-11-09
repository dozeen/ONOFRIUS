/**
 * RelevanceFilter.js - Selezionatore di Pertinenza Cognitiva per il Prompt Builder
 * 
 * Evita di contaminare i prompt con fatti o pensieri irrilevanti o del passato.
 * Seleziona solo le intenzioni e gli eventi dell'agenda pertinent alle parole chiave dello stimolo.
 */

class RelevanceFilter {
    static INPUT = ["items", "inputText"];
    static OUTPUT = ["relevantItems"];

    /**
     * Filtra una lista di pensieri/intenzioni mantenendo solo quelli pertinenti al contesto corrente
     * @param {Array} items - Lista di pensieri/intenzioni
     * @param {string} inputText - Messaggio in ingresso
     * @returns {Array} Elementi pertinenti
     */
    static filterRelevantThoughts(items, inputText = "") {
        if (!items || !Array.isArray(items) || items.length === 0) return [];
        if (!inputText) return items.slice(0, 3); // Limita comunque a max 3 pensieri generali

        const lowerInput = inputText.toLowerCase();
        const keywords = lowerInput.split(/\s+/).filter(w => w.length > 3);

        const relevant = items.filter(item => {
            const itemText = (typeof item === "string" ? item : (item.content || "")).toLowerCase();
            // Se il pensiero contiene una delle parole chiave del messaggio d'ingresso
            return keywords.some(kw => itemText.includes(kw));
        });

        // Se non trova parole chiave esatte, restituisce al massimo 2 pensieri recenti per evitare affollamento
        if (relevant.length === 0) {
            return items.slice(0, 2);
        }

        return relevant;
    }
}

module.exports = RelevanceFilter;
