// ============================================
// FINANZAS: sistema económico de la AFA
// ============================================

const INGRESO_BASE_ANUAL = 7000;
const EGRESO_BASE_ANUAL = 7500;

// -----------------------------
// SPONSORS
// -----------------------------

const SPONSORS_DISPONIBLES = [
    { id: "ypf", nombre: "YPF", rubro: "Energía", montoBase: 1200, bonusPrestigio: 300, popularidad: "popular" },
    { id: "quilmes", nombre: "Quilmes", rubro: "Cerveza", montoBase: 900, bonusPrestigio: 200, popularidad: "popular" },
    { id: "banco_macro", nombre: "Banco Macro", rubro: "Banco", montoBase: 1100, bonusPrestigio: 250, popularidad: "neutral" },
    { id: "personal", nombre: "Personal", rubro: "Telecom", montoBase: 1000, bonusPrestigio: 200, popularidad: "neutral" },
    { id: "directv", nombre: "DirecTV", rubro: "TV", montoBase: 1300, bonusPrestigio: 350, popularidad: "neutral" },
    { id: "coca_cola", nombre: "Coca-Cola", rubro: "Bebida", montoBase: 1500, bonusPrestigio: 400, popularidad: "neutral" },
    { id: "mcdonalds", nombre: "McDonald's", rubro: "Comida", montoBase: 1400, bonusPrestigio: 300, popularidad: "polemico" },
    { id: "nike", nombre: "Nike", rubro: "Deportivo", montoBase: 1600, bonusPrestigio: 400, popularidad: "neutral" },
    { id: "adidas", nombre: "Adidas", rubro: "Deportivo", montoBase: 1600, bonusPrestigio: 400, popularidad: "neutral" },
    { id: "mastercard", nombre: "Mastercard", rubro: "Financiero", montoBase: 1300, bonusPrestigio: 250, popularidad: "polemico" },
    { id: "aerolineas", nombre: "Aerolíneas Argentinas", rubro: "Aerolínea", montoBase: 800, bonusPrestigio: 200, popularidad: "popular" }
];

// -----------------------------
// ESTADO FINANCIERO
// -----------------------------

const estadoFinanzas = {
    sponsorActual: null,
    ingresosDelAnio: 0,
    egresosDelAnio: 0,
    historial: [],
    eventosDelAnio: [],
    rescates: {},
    nivelDeuda: {}
};

// -----------------------------
// DEUDAS INICIALES
// -----------------------------

function asignarDeudasIniciales() {
    const primeraIds = LIGAS.primera.equipos.slice();

    const ordenadosPorPeso = primeraIds.slice().sort(function(a, b) {
        return EQUIPOS[a].pesoHistorico - EQUIPOS[b].pesoHistorico;
    });
    const enCrisis = ordenadosPorPeso.slice(0, 2);
    enCrisis.forEach(function(id) {
        estadoFinanzas.nivelDeuda[id] = "crisis";
    });

    const ajustados = ordenadosPorPeso.slice(2, 5);
    ajustados.forEach(function(id) {
        estadoFinanzas.nivelDeuda[id] = "ajustado";
    });

    const nacionalIds = LIGAS.nacional.equipos.slice();
    const ordenadosNacional = nacionalIds.slice().sort(function(a, b) {
        return EQUIPOS[a].pesoHistorico - EQUIPOS[b].pesoHistorico;
    });
    estadoFinanzas.nivelDeuda[ordenadosNacional[0]] = "crisis";
    estadoFinanzas.nivelDeuda[ordenadosNacional[1]] = "ajustado";
    estadoFinanzas.nivelDeuda[ordenadosNacional[2]] = "ajustado";
}

// -----------------------------
// EFECTO DE LA DEUDA EN LA FUERZA
// -----------------------------

function penalizacionPorDeuda(idEquipo) {
    const nivel = estadoFinanzas.nivelDeuda[idEquipo];
    if (nivel === "ajustado") return 2;
    if (nivel === "crisis") return 5;
    if (nivel === "fundido") return 10;
    return 0;
}

// -----------------------------
// RESCATE DE CLUBES
// -----------------------------

// Costos aumentados 50% respecto a antes
const COSTOS_RESCATE = {
    ajustado: 750,
    crisis: 1800,
    fundido: 4500
};

function rescatarClub(idEquipo) {
    const nivel = estadoFinanzas.nivelDeuda[idEquipo];
    if (!nivel || nivel === "sano") return { exito: false, motivo: "El club ya está sano." };

    const costo = COSTOS_RESCATE[nivel];
    if (presidente.dineroEnCaja < costo) {
        return { exito: false, motivo: "No hay dinero suficiente." };
    }

    ajustarDinero(-costo);
    ajustarApoyo(-3);

    if (!estadoFinanzas.rescates[idEquipo]) estadoFinanzas.rescates[idEquipo] = 0;
    estadoFinanzas.rescates[idEquipo]++;

    const cantidad = estadoFinanzas.rescates[idEquipo];
    const equipo = EQUIPOS[idEquipo];
    let mensajePolitico = "";

    if (cantidad === 1) {
        mensajePolitico = "Los clubes aceptan el rescate, pero toman nota.";
    } else if (cantidad === 2) {
        ajustarApoyo(-3);
        mensajePolitico = "La prensa empieza a llamarte 'padrino' de " + equipo.nombre + ".";
    } else if (cantidad === 3) {
        ajustarApoyo(-7);
        mensajePolitico = "Titular: 'El presidente que salvó a " + equipo.nombre + " tres veces'.";
    } else {
        ajustarApoyo(-12);
        ajustarPrestigio(-4);
        mensajePolitico = "Escándalo: rescataste a " + equipo.nombre + " " + cantidad + " veces. Sos el hazmerreír.";
    }

    const nuevoNivel = subirNivelDeuda(nivel);
    estadoFinanzas.nivelDeuda[idEquipo] = nuevoNivel;

    estadoFinanzas.eventosDelAnio.push({
        tipo: "rescate",
        descripcion: "Rescataste a " + equipo.nombre + " (" + nivel + " → " + nuevoNivel + ")"
    });

    return {
        exito: true,
        costo: costo,
        mensajePolitico: mensajePolitico,
        nuevoNivel: nuevoNivel
    };
}

function subirNivelDeuda(nivel) {
    if (nivel === "fundido") return "crisis";
    if (nivel === "crisis") return "ajustado";
    if (nivel === "ajustado") return "sano";
    return "sano";
}

// -----------------------------
// EMPEORAMIENTO AUTOMÁTICO
// -----------------------------

function empeorarDeudasAlCierre() {
    Object.keys(estadoFinanzas.nivelDeuda).forEach(function(id) {
        const nivel = estadoFinanzas.nivelDeuda[id];
        if (nivel === "sano") return;

        // Aumentamos la probabilidad de empeorar a 40%
        if (Math.random() < 0.4) {
            const nuevoNivel = bajarNivelDeuda(nivel);
            estadoFinanzas.nivelDeuda[id] = nuevoNivel;
            estadoFinanzas.eventosDelAnio.push({
                tipo: "deuda",
                descripcion: EQUIPOS[id].nombre + " empeoró su situación (" + nivel + " → " + nuevoNivel + ")"
            });
        }
    });
}

function bajarNivelDeuda(nivel) {
    if (nivel === "ajustado") return "crisis";
    if (nivel === "crisis") return "fundido";
    return "fundido";
}

// -----------------------------
// SPONSORS ANUALES
// -----------------------------

function generarOfertasSponsors() {
    const copia = SPONSORS_DISPONIBLES.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia.slice(0, 3);
}

function firmarSponsor(sponsor) {
    estadoFinanzas.sponsorActual = sponsor;

    if (sponsor.popularidad === "popular") {
        ajustarApoyo(3);
    } else if (sponsor.popularidad === "polemico") {
        ajustarApoyo(-3);
    }

    estadoFinanzas.eventosDelAnio.push({
        tipo: "sponsor",
        descripcion: "Firmaste con " + sponsor.nombre + " (" + sponsor.popularidad + ")"
    });
}

// -----------------------------
// BONUS POR AUDIENCIA (reducido)
// -----------------------------

function calcularBonusAudiencia() {
    let bonus = 0;

    const top5Primera = obtenerTablaOrdenada("primera").slice(0, 5);
    let grandesEnTop5 = 0;
    top5Primera.forEach(function(eq) {
        if (EQUIPOS[eq.id].pesoHistorico >= 75) grandesEnTop5++;
    });
    bonus += grandesEnTop5 * 150; // antes 300

    const tablaPrimera = Object.values(estadoLigas.tablas.primera);
    let golesTotales = 0;
    tablaPrimera.forEach(function(eq) {
        golesTotales += eq.GF;
    });
    if (golesTotales > 900) bonus += 400;      // antes 800
    else if (golesTotales > 750) bonus += 250; // antes 500
    else if (golesTotales > 600) bonus += 100; // antes 200

    const campeon = top5Primera[0];
    if (campeon && EQUIPOS[campeon.id].pesoHistorico >= 80) {
        bonus += 350; // antes 700
    }

    return bonus;
}

// -----------------------------
// INGRESOS Y EGRESOS
// -----------------------------

function cobrarIngresosAnuales() {
    let ingresos = INGRESO_BASE_ANUAL;

    if (estadoFinanzas.sponsorActual) {
        ingresos += estadoFinanzas.sponsorActual.montoBase;
    }

    if (estadoFinanzas.sponsorActual && presidente.prestigioInternacional >= 60) {
        ingresos += estadoFinanzas.sponsorActual.bonusPrestigio;
    }

    const bonusAudiencia = calcularBonusAudiencia();
    ingresos += bonusAudiencia;

    ajustarDinero(ingresos);
    estadoFinanzas.ingresosDelAnio = ingresos;
    estadoFinanzas.eventosDelAnio.push({
        tipo: "ingreso",
        descripcion: "Ingresos anuales: +$" + ingresos + "M"
    });

    return ingresos;
}

function cobrarEgresosAnuales() {
    let egresos = EGRESO_BASE_ANUAL;

    // Sueldo del DT de la Selección
    const sueldo = sueldoDTActual();
    if (sueldo > 0) {
        egresos += sueldo;
    }

    ajustarDinero(-egresos);
    estadoFinanzas.egresosDelAnio = egresos;
    estadoFinanzas.eventosDelAnio.push({
        tipo: "egreso",
        descripcion: "Egresos anuales: -$" + egresos + "M (estructura + sueldo DT)"
    });

    return egresos;
}

// -----------------------------
// CIERRE DEL AÑO
// -----------------------------

function cerrarAnioFinanciero() {
    const balance = estadoFinanzas.ingresosDelAnio - estadoFinanzas.egresosDelAnio;

    estadoFinanzas.historial.push({
        anio: presidente.anioMandato,
        ingresos: estadoFinanzas.ingresosDelAnio,
        egresos: estadoFinanzas.egresosDelAnio,
        balance: balance,
        eventos: estadoFinanzas.eventosDelAnio.slice()
    });

    estadoFinanzas.ingresosDelAnio = 0;
    estadoFinanzas.egresosDelAnio = 0;
    estadoFinanzas.eventosDelAnio = [];
}

// -----------------------------
// INFO PARA LA INTERFAZ
// -----------------------------

function obtenerResumenFinanciero() {
    return {
        sponsor: estadoFinanzas.sponsorActual,
        ingresos: estadoFinanzas.ingresosDelAnio,
        egresos: estadoFinanzas.egresosDelAnio,
        balance: estadoFinanzas.ingresosDelAnio - estadoFinanzas.egresosDelAnio,
        historial: estadoFinanzas.historial,
        eventos: estadoFinanzas.eventosDelAnio
    };
}

function obtenerClubesConDeuda() {
    const lista = [];
    Object.keys(estadoFinanzas.nivelDeuda).forEach(function(id) {
        const nivel = estadoFinanzas.nivelDeuda[id];
        if (nivel === "sano") return;
        lista.push({
            id: parseInt(id),
            nombre: EQUIPOS[id].nombre,
            liga: LIGAS[EQUIPOS[id].ligaId].nombre,
            nivel: nivel,
            rescates: estadoFinanzas.rescates[id] || 0,
            costoRescate: COSTOS_RESCATE[nivel]
        });
    });
    return lista;
}