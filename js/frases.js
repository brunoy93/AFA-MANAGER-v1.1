// ============================================
// FRASES: toques argentinos sutiles
// ============================================

const FRASES = {
    exito: [
        "¡Vamooo!",
        "¡Qué grande!",
        "¡De no creer!",
        "¡Dale que va!",
        "¡Tremendo!"
    ],
    fracaso: [
        "Uh, la p...",
        "No da...",
        "Qué papelón...",
        "Se pinchó...",
        "No puede ser..."
    ],
    alerta: [
        "Ojo al piojo...",
        "Atenti...",
        "Mucho cuidado...",
        "Se viene la mano..."
    ],
    neutro: [
        "Seguimos...",
        "A laburar...",
        "Dale que va...",
        "Vamos por más..."
    ]
};

function fraseAlAzar(tipo) {
    const lista = FRASES[tipo] || FRASES.neutro;
    return lista[Math.floor(Math.random() * lista.length)];
}

// Frases contextuales
function fraseCopaCampeon() { return "¡Vamooo, la Copa es nuestra!"; }
function fraseCopaSubcampeon() { return "Cerca, pero no alcanzó. La próxima."; }
function fraseCopaEliminado() { return "Uh, la p... Qué dolor."; }
function fraseRankingTop() { return "Estamos en la cima del mundo."; }
function fraseRankingBajo() { return "Hay que remontar. A laburar."; }
function fraseApoyoBajo() { return "Los clubes están que trinan..."; }
function fraseApoyoAlto() { return "Todo tranquilo por suerte."; }