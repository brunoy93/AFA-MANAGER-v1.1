// ============================================
// PRENSA: conferencias de prensa con periodistas
// ============================================
// Cada ~18 fechas, un periodista te hace 2 preguntas.
// Tus respuestas afectan apoyo/prestigio/caja.

const conferenciasHistoricas = [];

// -----------------------------
// PREGUNTAS POR PERSONALIDAD
// -----------------------------

const PREGUNTAS = {
    carrozza: [
        {
            texto: "Presidente, el VAR sigue sin implementarse y el último clásico tuvo errores graves. ¿Qué le responde a los hinchas?",
            opciones: [
                { texto: "El costo es alto, lo estamos evaluando", efecto: function() { ajustarApoyo(-2); }, resumen: "-2 apoyo" },
                { texto: "El VAR no resuelve todo", efecto: function() { ajustarPrestigio(1); ajustarApoyo(-2); }, resumen: "+1 prestigio, -2 apoyo" },
                { texto: "Lo vamos a implementar antes de fin de año", efecto: function() { ajustarApoyo(3); ajustarPrestigio(-1); }, resumen: "+3 apoyo, -1 prestigio (promesa)" }
            ]
        },
        {
            texto: "Los clubes del Interior siguen reclamando por el reparto de TV. ¿Vas a hacer algo?",
            opciones: [
                { texto: "Vamos a igualar el reparto", efecto: function() { ajustarApoyo(5); ajustarDinero(-800); }, resumen: "+5 apoyo, -$800M" },
                { texto: "El reparto actual es justo", efecto: function() { ajustarApoyo(-3); ajustarDinero(200); }, resumen: "-3 apoyo, +$200M" },
                { texto: "Sin comentarios", efecto: function() {}, resumen: "Sin efecto" }
            ]
        },
        {
            texto: "Hay rumores de corrupción interna que involucran a exdirectivos. ¿Vas a investigar?",
            opciones: [
                { texto: "Vamos a investigar a fondo", efecto: function() { ajustarPrestigio(5); ajustarApoyo(-2); ajustarDinero(-300); }, resumen: "+5 prestigio, -2 apoyo, -$300M" },
                { texto: "No hay nada que investigar", efecto: function() { ajustarApoyo(-4); ajustarPrestigio(-4); }, resumen: "-4 apoyo, -4 prestigio" },
                { texto: "Sin comentarios", efecto: function() {}, resumen: "Sin efecto" }
            ]
        },
        {
            texto: "Hay un nuevo libro de un exárbitro con acusaciones fuertes. ¿Qué opina la AFA?",
            opciones: [
                { texto: "Vamos a responder públicamente", efecto: function() { ajustarDinero(-200); ajustarPrestigio(3); }, resumen: "-$200M, +3 prestigio" },
                { texto: "Lo ignoramos", efecto: function() { ajustarPrestigio(-3); }, resumen: "-3 prestigio" },
                { texto: "Vamos a investigar las denuncias", efecto: function() { ajustarPrestigio(4); ajustarApoyo(-1); }, resumen: "+4 prestigio, -1 apoyo" }
            ]
        }
    ],

    bambino: [
        {
            texto: "¡Qué lindo, presidente! La Selección viene bien. ¿Cómo ve el futuro de la era post-Messi?",
            opciones: [
                { texto: "Vamos a construir algo grande", efecto: function() { ajustarPrestigio(3); ajustarApoyo(2); }, resumen: "+3 prestigio, +2 apoyo" },
                { texto: "Hay que ser prudentes", efecto: function() {}, resumen: "Sin efecto" },
                { texto: "El objetivo es ganar el próximo Mundial", efecto: function() { ajustarPrestigio(4); ajustarApoyo(-1); }, resumen: "+4 prestigio, -1 apoyo (presión)" }
            ]
        },
        {
            texto: "Los pibes de las inferiores están rompiendo récords. ¿Vas a invertir más en juveniles?",
            opciones: [
                { texto: "Sí, vamos a invertir fuerte", efecto: function() { ajustarDinero(-600); ajustarPrestigio(5); }, resumen: "-$600M, +5 prestigio" },
                { texto: "Con lo que tenemos alcanza", efecto: function() { ajustarApoyo(-2); }, resumen: "-2 apoyo" },
                { texto: "Vamos a buscar sponsors para juveniles", efecto: function() { ajustarDinero(300); ajustarPrestigio(2); }, resumen: "+$300M, +2 prestigio" }
            ]
        },
        {
            texto: "El fútbol femenino viene creciendo. ¿Se viene la profesionalización?",
            opciones: [
                { texto: "Sí, es el momento", efecto: function() { ajustarDinero(-1000); ajustarPrestigio(6); }, resumen: "-$1.000M, +6 prestigio" },
                { texto: "Paso a paso", efecto: function() { ajustarPrestigio(2); }, resumen: "+2 prestigio" },
                { texto: "No está en la agenda", efecto: function() { ajustarPrestigio(-4); }, resumen: "-4 prestigio" }
            ]
        },
        {
            texto: "¡Qué fiesta la de los hinchas en la última fecha! ¿Vas a permitir visitantes en las canchas?",
            opciones: [
                { texto: "Sí, es hora", efecto: function() { ajustarApoyo(5); ajustarDinero(300); ajustarPrestigio(-3); }, resumen: "+5 apoyo, +$300M, -3 prestigio" },
                { texto: "Solo en clásicos", efecto: function() { ajustarApoyo(2); }, resumen: "+2 apoyo" },
                { texto: "No por ahora", efecto: function() { ajustarApoyo(-3); ajustarPrestigio(2); }, resumen: "-3 apoyo, +2 prestigio" }
            ]
        }
    ],

    liberman: [
        {
            texto: "Presidente, le voy a ser frontal: la gestión no arrancó bien. ¿Qué le dice al hincha?",
            opciones: [
                { texto: "Vamos a enderezar el rumbo", efecto: function() { ajustarApoyo(3); ajustarPrestigio(2); }, resumen: "+3 apoyo, +2 prestigio" },
                { texto: "Los resultados van a llegar", efecto: function() {}, resumen: "Sin efecto" },
                { texto: "Las críticas no me afectan", efecto: function() { ajustarApoyo(-5); ajustarPrestigio(-2); }, resumen: "-5 apoyo, -2 prestigio" }
            ]
        },
        {
            texto: "Los clubes chicos están quebrando. ¿Qué hace la AFA?",
            opciones: [
                { texto: "Vamos a rescatarlos", efecto: function() { ajustarDinero(-800); ajustarApoyo(6); }, resumen: "-$800M, +6 apoyo" },
                { texto: "Que se arreglen solos", efecto: function() { ajustarApoyo(-6); ajustarPrestigio(-2); }, resumen: "-6 apoyo, -2 prestigio" },
                { texto: "Vamos a dar préstamos blandos", efecto: function() { ajustarDinero(-400); ajustarApoyo(3); }, resumen: "-$400M, +3 apoyo" }
            ]
        },
        {
            texto: "El apoyo al presidente está bajo. ¿Piensa en renunciar?",
            opciones: [
                { texto: "De ninguna manera", efecto: function() { ajustarApoyo(2); }, resumen: "+2 apoyo" },
                { texto: "Voy a terminar mi mandato", efecto: function() { ajustarApoyo(1); ajustarPrestigio(2); }, resumen: "+1 apoyo, +2 prestigio" },
                { texto: "Si los clubes lo piden, lo evalúo", efecto: function() { ajustarApoyo(-4); }, resumen: "-4 apoyo" }
            ]
        },
        {
            texto: "¿Por qué no se toman medidas más duras contra los violentos?",
            opciones: [
                { texto: "Vamos a endurecer las sanciones", efecto: function() { ajustarPrestigio(5); ajustarApoyo(-3); }, resumen: "+5 prestigio, -3 apoyo" },
                { texto: "La AFA no tiene esas facultades", efecto: function() { ajustarApoyo(-4); ajustarPrestigio(-3); }, resumen: "-4 apoyo, -3 prestigio" },
                { texto: "Estamos trabajando en eso", efecto: function() {}, resumen: "Sin efecto" }
            ]
        }
    ]
};

// -----------------------------
// GENERAR UNA CONFERENCIA
// -----------------------------

function generarConferencia() {
    // Elegimos la personalidad según el contexto
    const apoyo = presidente.apoyoClubes;
    let personalidad;

    if (apoyo < 40) {
        // Crisis: Carrozza 40%, Liberman 50%, Bambino 10%
        personalidad = elegirPonderado([
            { valor: "carrozza", peso: 40 },
            { valor: "liberman", peso: 50 },
            { valor: "bambino", peso: 10 }
        ]);
    } else if (apoyo > 70) {
        // Éxito: Carrozza 20%, Liberman 15%, Bambino 65%
        personalidad = elegirPonderado([
            { valor: "carrozza", peso: 20 },
            { valor: "liberman", peso: 15 },
            { valor: "bambino", peso: 65 }
        ]);
    } else {
        // Neutro
        personalidad = elegirPonderado([
            { valor: "carrozza", peso: 33 },
            { valor: "liberman", peso: 34 },
            { valor: "bambino", peso: 33 }
        ]);
    }

    // Elegimos 2 preguntas al azar de esa personalidad
    const preguntasDisponibles = PREGUNTAS[personalidad].slice();
    // Mezclar
    for (let i = preguntasDisponibles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preguntasDisponibles[i], preguntasDisponibles[j]] = [preguntasDisponibles[j], preguntasDisponibles[i]];
    }

    const preguntasElegidas = preguntasDisponibles.slice(0, 2);

    return {
        personalidad: personalidad,
        preguntas: preguntasElegidas
    };
}

function elegirPonderado(lista) {
    const total = lista.reduce(function(s, x) { return s + x.peso; }, 0);
    let random = Math.random() * total;
    for (let i = 0; i < lista.length; i++) {
        random -= lista[i].peso;
        if (random <= 0) return lista[i].valor;
    }
    return lista[lista.length - 1].valor;
}

// -----------------------------
// REGISTRAR LA CONFERENCIA EN NOTICIAS
// -----------------------------

function registrarConferencia(personalidad, cantidadRespondidas) {
    conferenciasHistoricas.push({
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        personalidad: personalidad,
        respondidas: cantidadRespondidas
    });
}