// ============================================
// PRESIDENTE: estado del presidente de la AFA
// ============================================

const presidente = {
    nombre: "Usted",
    anioMandato: 1,
    anioMaximo: 4,
    apoyoClubes: 50,
    prestigioInternacional: 50,
    dineroEnCaja: 11000,
    seleccionador: null,
    varActivo: false,
    historialDecisiones: []
};

// Sueldos anuales de cada DT (en millones)
const SUELDOS_DT = {
    "Pablo Aimar": 300,
    "Walter Samuel": 250,
    "Diego Simeone": 800,
    "Marcelo Gallardo": 500,
    "Javier Mascherano": 400,
    "Antonio Mohamed": 200
};

function sueldoDTActual() {
    if (!presidente.seleccionador) return 0;
    return SUELDOS_DT[presidente.seleccionador] || 0;
}

// --- Ajustes rápidos de valores ---

function ajustarApoyo(cantidad) {
    presidente.apoyoClubes = Math.max(0, Math.min(100, presidente.apoyoClubes + cantidad));
}

function ajustarPrestigio(cantidad) {
    presidente.prestigioInternacional = Math.max(0, Math.min(100, presidente.prestigioInternacional + cantidad));
}

function ajustarDinero(cantidad) {
    presidente.dineroEnCaja = Math.max(0, presidente.dineroEnCaja + cantidad);
}