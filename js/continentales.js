// ============================================
// CONTINENTALES: Libertadores + Sudamericana
// ============================================
// Se juegan al final de cada temporada.
// Los 4 primeros de la tabla anual de Primera van a Libertadores.
// Los siguientes 4 (5°-8°) van a Sudamericana.
// Solo simulamos "hasta dónde llega" cada club argentino.

// Rivales continentales (clubes fuertes de Sudamérica)
const RIVALES_CONTINENTALES = [
    { nombre: "Flamengo", fuerza: 88, pais: "Brasil" },
    { nombre: "Palmeiras", fuerza: 87, pais: "Brasil" },
    { nombre: "Botafogo", fuerza: 85, pais: "Brasil" },
    { nombre: "Fluminense", fuerza: 84, pais: "Brasil" },
    { nombre: "São Paulo", fuerza: 83, pais: "Brasil" },
    { nombre: "Internacional", fuerza: 82, pais: "Brasil" },
    { nombre: "Atlético Mineiro", fuerza: 84, pais: "Brasil" },
    { nombre: "Cruzeiro", fuerza: 82, pais: "Brasil" },
    { nombre: "Peñarol", fuerza: 78, pais: "Uruguay" },
    { nombre: "Nacional", fuerza: 77, pais: "Uruguay" },
    { nombre: "Colo-Colo", fuerza: 76, pais: "Chile" },
    { nombre: "Universidad Católica", fuerza: 74, pais: "Chile" },
    { nombre: "Atlético Nacional", fuerza: 78, pais: "Colombia" },
    { nombre: "Millonarios", fuerza: 76, pais: "Colombia" },
    { nombre: "Cerro Porteño", fuerza: 75, pais: "Paraguay" },
    { nombre: "Libertad", fuerza: 74, pais: "Paraguay" },
    { nombre: "LDU Quito", fuerza: 76, pais: "Ecuador" },
    { nombre: "Barcelona SC", fuerza: 74, pais: "Ecuador" },
    { nombre: "Alianza Lima", fuerza: 73, pais: "Perú" },
    { nombre: "Universitario", fuerza: 72, pais: "Perú" },
    { nombre: "Bolívar", fuerza: 73, pais: "Bolivia" },
    { nombre: "The Strongest", fuerza: 71, pais: "Bolivia" },
    { nombre: "Caracas FC", fuerza: 70, pais: "Venezuela" },
    { nombre: "Deportivo Táchira", fuerza: 69, pais: "Venezuela" }
];

// Etapas de la Libertadores
const ETAPAS_LIBERTADORES = [
    { id: "grupos", nombre: "Fase de grupos" },
    { id: "octavos", nombre: "Octavos de final" },
    { id: "cuartos", nombre: "Cuartos de final" },
    { id: "semis", nombre: "Semifinales" },
    { id: "final", nombre: "Final" },
    { id: "campeon", nombre: "Campeón" }
];

// Etapas de la Sudamericana (arranca en octavos, es más corta)
const ETAPAS_SUDAMERICANA = [
    { id: "grupos", nombre: "Fase de grupos" },
    { id: "octavos", nombre: "Octavos de final" },
    { id: "cuartos", nombre: "Cuartos de final" },
    { id: "semis", nombre: "Semifinales" },
    { id: "final", nombre: "Final" },
    { id: "campeon", nombre: "Campeón" }
];

// Premios por etapa alcanzada (en millones para la AFA)
const PREMIOS_ETAPA = {
    grupos: 70,
    octavos: 200,
    cuartos: 400,
    semis: 700,
    final: 1000,
    campeon: 1700
};

// Historial de campañas continentales
const historialContinentales = [];

// -----------------------------
// SIMULAR LA CAMPAÑA DE UN CLUB
// -----------------------------
// Un club avanza si su fuerza es suficiente para superar a los rivales de cada etapa.
// Usamos un sistema probabilístico: cada etapa tiene una probabilidad de pasar
// basada en la fuerza del club vs la fuerza promedio de los rivales.

function simularCampana(club, etapas, esLibertadores) {
    const fuerzaClub = club.fuerza;
    let etapaAlcanzada = "grupos";
    let rivalEliminatorio = null;

    for (let i = 0; i < etapas.length; i++) {
        const etapa = etapas[i];

        // Elegimos un rival al azar (excepto en grupos que se juega contra varios)
        const rival = RIVALES_CONTINENTALES[
            Math.floor(Math.random() * RIVALES_CONTINENTALES.length)
        ];

        // Probabilidad de pasar de etapa
        // Base: 50%, ajustada por diferencia de fuerza
        const dif = fuerzaClub - rival.fuerza;
        let probPasar = 0.5 + dif / 100;

        // En grupos es más fácil pasar (2 de 4 equipos pasan)
        if (etapa.id === "grupos") probPasar += 0.2;

        // En la final es más difícil (es a un solo partido y contra los mejores)
        if (etapa.id === "final") probPasar -= 0.1;

        // Limitar probabilidad entre 0.05 y 0.95
        probPasar = Math.max(0.05, Math.min(0.95, probPasar));

        if (Math.random() < probPasar) {
            // Pasó de etapa
            if (etapa.id === "campeon") {
                etapaAlcanzada = "campeon";
                break;
            }
            etapaAlcanzada = etapa.id;
        } else {
            // Quedó eliminado en esta etapa
            etapaAlcanzada = etapa.id === "grupos" ? "grupos" : etapa.id;
            rivalEliminatorio = rival;
            break;
        }
    }

    // Si pasó todas las etapas, es campeón
    const ultimaEtapa = etapas[etapas.length - 1];
    if (etapaAlcanzada === "final" && ultimaEtapa.id === "campeon") {
        etapaAlcanzada = "campeon";
    }

    return {
        club: club.nombre,
        clubId: club.id,
        fuerza: fuerzaClub,
        etapa: etapaAlcanzada,
        rivalEliminatorio: rivalEliminatorio ? rivalEliminatorio.nombre : null,
        torneo: esLibertadores ? "Libertadores" : "Sudamericana"
    };
}

// -----------------------------
// SIMULAR LA COPA COMPLETA
// -----------------------------

function simularContinentales() {
    // 1) Obtener los 8 mejores de Primera (tabla anual = tabla actual)
    const tablaPrimera = obtenerTablaOrdenada("primera");
    const clasificados = tablaPrimera.slice(0, 8);

    // Los 4 primeros van a Libertadores, los 4 siguientes a Sudamericana
    const libertadores = clasificados.slice(0, 4).map(function(eq) {
        return { id: eq.id, nombre: eq.nombre, fuerza: EQUIPOS[eq.id].fuerza };
    });

    const sudamericana = clasificados.slice(4, 8).map(function(eq) {
        return { id: eq.id, nombre: eq.nombre, fuerza: EQUIPOS[eq.id].fuerza };
    });

    // 2) Simular cada campaña
    const campanasLibertadores = libertadores.map(function(club) {
        return simularCampana(club, ETAPAS_LIBERTADORES, true);
    });

    const campanasSudamericana = sudamericana.map(function(club) {
        return simularCampana(club, ETAPAS_SUDAMERICANA, false);
    });

    // 3) Aplicar premios y prestigio
    let dineroTotal = 0;
    let prestigioTotal = 0;

    campanasLibertadores.forEach(function(c) {
        dineroTotal += PREMIOS_ETAPA[c.etapa];
        prestigioTotal += calcularPrestigioPorEtapa(c.etapa);
    });

    campanasSudamericana.forEach(function(c) {
        // La Sudamericana da la mitad de premios
        dineroTotal += Math.floor(PREMIOS_ETAPA[c.etapa] / 2);
        prestigioTotal += Math.floor(calcularPrestigioPorEtapa(c.etapa) / 2);
    });

    ajustarDinero(dineroTotal);
    ajustarPrestigio(prestigioTotal);

    // 4) Guardar en el historial
    const resumen = {
        anio: presidente.anioMandato,
        libertadores: campanasLibertadores,
        sudamericana: campanasSudamericana,
        dineroTotal: dineroTotal,
        prestigioTotal: prestigioTotal
    };

    historialContinentales.push(resumen);

    // 5) Noticias destacadas
    generarNoticiasContinentales(resumen);

    return resumen;
}

function calcularPrestigioPorEtapa(etapa) {
    const mapa = {
        grupos: 0,
        octavos: 1,
        cuartos: 3,
        semis: 6,
        final: 10,
        campeon: 15
    };
    return mapa[etapa] || 0;
}

// -----------------------------
// NOTICIAS DE CONTINENTALES
// -----------------------------

function generarNoticiasContinentales(resumen) {
    // ¿Alguien ganó la Libertadores?
    const campeonLibertadores = resumen.libertadores.find(function(c) {
        return c.etapa === "campeon";
    });
    if (campeonLibertadores) {
        agregarNoticia(
            "Olé",
            "¡" + campeonLibertadores.club + " campeón de la Copa Libertadores!",
            "El fútbol argentino vuelve a lo más alto de Sudamérica. Fiesta total en las calles.",
            "elogio"
        );
    }

    // ¿Alguien llegó a la final?
    const finalista = resumen.libertadores.find(function(c) {
        return c.etapa === "final";
    });
    if (finalista) {
        agregarNoticia(
            medioAlAzar(),
            finalista.club + " jugará la final de la Libertadores",
            "El equipo argentino se metió entre los dos mejores del continente. Ilusión total.",
            "rumor"
        );
    }

    // ¿Alguien ganó la Sudamericana?
    const campeonSud = resumen.sudamericana.find(function(c) {
        return c.etapa === "campeon";
    });
    if (campeonSud) {
        agregarNoticia(
            "TyC Sports",
            "¡" + campeonSud.club + " campeón de la Copa Sudamericana!",
            "Otro título internacional para el fútbol argentino. Gran campaña del equipo.",
            "elogio"
        );
    }

    // ¿Todos eliminados en fase de grupos?
    const todosGruposLibertadores = resumen.libertadores.every(function(c) {
        return c.etapa === "grupos";
    });
    if (todosGruposLibertadores) {
        agregarNoticia(
            "Azz",
            "Papelón continental: los clubes argentinos, eliminados en fase de grupos",
            "Ningún equipo pasó de la primera fase de la Libertadores. La prensa habla de crisis del fútbol argentino.",
            "critica"
        );
    }
}

// -----------------------------
// OBTENER CAMPAÑAS DEL ÚLTIMO AÑO
// -----------------------------

function obtenerCampañasUltimoAnio() {
    if (historialContinentales.length === 0) return null;
    return historialContinentales[historialContinentales.length - 1];
}

function obtenerHistorialContinentales() {
    return historialContinentales;
}