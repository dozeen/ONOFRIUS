/**
 * Gordon 3 - Commercial Policy
 *
 * Regole centrali per le decisioni economiche.
 *
 * PRINCIPIO:
 * Gordon può conoscere prezzi e riferimenti economici,
 * ma NON può inventare, modificare o negoziare prezzi.
 *
 * La decisione economica finale appartiene a Onofrio.
 */

const CommercialPolicy = {

    // =====================================================
    // AUTORITÀ
    // =====================================================

    ownerDecidesPrices: true,

    // =====================================================
    // PREZZO DI RIFERIMENTO
    // =====================================================
    //
    // Serve a Gordon per ragionamento interno.
    // NON equivale a un prezzo concordato con il cliente.
    // NON deve essere comunicato automaticamente.
    // =====================================================

    referencePrice: 300,

    currency: "EUR",

    // =====================================================
    // PREZZI VERIFICATI
    // =====================================================

    allowVerifiedPrices: true,

    // Un prezzo stimato/non verificato non può essere
    // comunicato come prezzo reale al cliente.
    allowEstimatedPricesToCustomer: false,

    // =====================================================
    // DECISIONI RISERVATE A ONOFRIO
    // =====================================================

    requireOwnerApprovalFor: [

        "new_price",
        "price_confirmation",
        "price_change",
        "discount",
        "extra",
        "refund"

    ],

    // =====================================================
    // HELPER
    // =====================================================

    getReferencePrice() {

        return this.referencePrice;

    },

    getCurrency() {

        return this.currency;

    },

    requiresOwnerApproval(action) {

        return this.requireOwnerApprovalFor.includes(action);

    },

    canCommunicateEstimatedPrice() {

        return this.allowEstimatedPricesToCustomer;

    },

    canCommunicateVerifiedPrice() {

        return this.allowVerifiedPrices;

    }

};

module.exports = CommercialPolicy;
