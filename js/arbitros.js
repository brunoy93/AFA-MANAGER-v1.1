// ============================================
// ÁRBITROS: cuerpo arbitral + efecto en partidos + VAR + designación manual
// ============================================

// -----------------------------
// CUERPO ARBITRAL
// -----------------------------

const ARBITROS_PRIMERA = [
    { id: 1, nombre: "Darío Herrera", nivel: 88, estilo: "muy estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 2, nombre: "Facundo Tello", nivel: 90, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 3, nombre: "Leandro Rey Hilfer", nivel: 85, estilo: "estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 4, nombre: "Fernando Espinoza", nivel: 82, estilo: "muy estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 5, nombre: "Yael Falcón Pérez", nivel: 84, estilo: "estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 6, nombre: "Nazareno Arasa", nivel: 80, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 7, nombre: "Andrés Merlos", nivel: 81, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 8, nombre: "Pablo Echavarría", nivel: 79, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 9, nombre: "Hernán Mastrángelo", nivel: 78, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 10, nombre: "Fernando Echenique", nivel: 80, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 11, nombre: "Silvio Trucco", nivel: 77, estilo: "permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 12, nombre: "Nicolás Ramírez", nivel: 76, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 13, nombre: "Sebastián Zunino", nivel: 75, estilo: "permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 14, nombre: "Pablo Dóvalo", nivel: 72, estilo: "permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 15, nombre: "Jorge Baliño", nivel: 70, estilo: "muy permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 }
];

function generarArbitrosFicticios(ligaId) {
    const nombres = [
        "Ariel Ríos", "Gustavo Peralta", "Martín Salcedo", "Rodrigo Bustos",
        "Ezequiel Ferrari", "Lucas Bermúdez", "Diego Villalba", "Matías Ferreyra",
        "Nicolás Aguirre", "Emiliano Correa", "Pablo Monasterio", "Juan Cruz Molina",
        "Sergio Roldán", "Federico Paz", "Alan Quiroga", "Héctor Barrios",
        "Tomás Cardozo", "Iván Sosa", "Rubén Alcaraz", "Leandro Oliva"
    ];
    const estilos = ["permisivo", "medio", "estricto", "muy estricto"];

    const arbitros = [];
    const usados = new Set();
    for (let i = 0; i < 15; i++) {
        let nombre;
        do {
            nombre = nombres[Math.floor(Math.random() * nombres.length)];
        } while (usados.has(nombre));
        usados.add(nombre);

        arbitros.push({
            id: (ligaId === "nacional" ? 100 : 200) + i,
            nombre: nombre,
            nivel: 50 + Math.floor(Math.random() * 30),
            estilo: estilos[Math.floor(Math.random() * estilos.length)],
            incidencias: 0,
            sancionado: false,
            fechasSancion: 0
        });
    }
    return arbitros;
}

const ARBITROS = {
    primera: ARBITROS_PRIMERA,
    nacional: generarArbitrosFicticios("nacional"),
    federalA: generarArbitrosFicticios("federalA")
};

// -----------------------------
// DESIGNACIÓN DE ÁRBITROS
// -----------------------------

const designacionesPorFecha = {};

function clavePartido(ligaId, numeroFecha, indicePartido) {
    return ligaId + "_" + numeroFecha + "_" + indicePartido;
}

// Designación automática (usa ranking de confiabilidad)
function designarArbitrosDeFecha(ligaId, numeroFecha) {
    const arbitros = ARBITROS[ligaId].filter(function(a) { return !a.sancionado; });
    if (arbitros.length === 0) return;

    const calendario = estadoLigas.calendarios[ligaId];
    if (!calendario || numeroFecha >= calendario.length) return;

    const fecha = calendario[numeroFecha];

    fecha.forEach(function(partido, indice) {
        const clave = clavePartido(ligaId, numeroFecha, indice);
        if (!designacionesPorFecha[clave]) {
            // Elegimos aleatoriamente pero ponderado por nivel (mejores árbitros más probables)
            const totalNivel = arbitros.reduce(function(sum, a) { return sum + a.nivel; }, 0);
            let random = Math.random() * totalNivel;
            let elegido = arbitros[0];
            for (let i = 0; i < arbitros.length; i++) {
                random -= arbitros[i].nivel;
                if (random <= 0) {
                    elegido = arbitros[i];
                    break;
                }
            }
            designacionesPorFecha[clave] = elegido.id;
        }
    });
}

function obtenerArbitroDePartido(ligaId, numeroFecha, indicePartido) {
    const clave = clavePartido(ligaId, numeroFecha, indicePartido);
    const idArbitro = designacionesPorFecha[clave];
    if (!idArbitro) return null;

    const arbitros = ARBITROS[ligaId];
    return arbitros.find(function(a) { return a.id === idArbitro; }) || null;
}

// Designación manual (para clásicos)
function designarArbitroManual(ligaId, numeroFecha, indicePartido, idArbitro) {
    const clave = clavePartido(ligaId, numeroFecha, indicePartido);
    designacionesPorFecha[clave] = idArbitro;
}

// -----------------------------
// EFECTO DEL ÁRBITRO EN EL PARTIDO
// -----------------------------

function aplicarEfectoArbitro(resultado, arbitro) {
    if (!arbitro) return { ...resultado, incidencia: null };

    const varActivo = presidente.varActivo === true;
    const factorVar = varActivo ? 0.5 : 1.0;

    const probabilidadIncidencia = 0.15 * factorVar;
    const factorNivel = 1 - (arbitro.nivel - 50) / 100;
    const probabilidadFinal = probabilidadIncidencia * factorNivel;

    if (Math.random() > probabilidadFinal) {
        return { ...resultado, incidencia: null };
    }

    // ¡Incidencia! Registramos en el contador del árbitro
    arbitro.incidencias++;

    const tipos = ["penal", "golAnulado", "rojaDudosa"];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const favoreceLocal = Math.random() < 0.5;

    let golesLocal = resultado.golesLocal;
    let golesVisitante = resultado.golesVisitante;
    let descripcion = "";

    if (tipo === "penal") {
        if (favoreceLocal) {
            golesLocal++;
            descripcion = "El árbitro " + arbitro.nombre + " cobró un penal dudoso a favor de " + resultado.local + ". Gol.";
        } else {
            golesVisitante++;
            descripcion = "El árbitro " + arbitro.nombre + " cobró un penal dudoso a favor de " + resultado.visitante + ". Gol.";
        }
    } else if (tipo === "golAnulado") {
        if (favoreceLocal && golesVisitante > 0) {
            golesVisitante--;
            descripcion = "El árbitro " + arbitro.nombre + " anuló un gol legítimo de " + resultado.visitante + " por un offside inexistente.";
        } else if (!favoreceLocal && golesLocal > 0) {
            golesLocal--;
            descripcion = "El árbitro " + arbitro.nombre + " anuló un gol legítimo de " + resultado.local + " por un offside inexistente.";
        } else {
            return { ...resultado, incidencia: null };
        }
    } else if (tipo === "rojaDudosa") {
        if (favoreceLocal && golesVisitante > 0 && Math.random() < 0.5) {
            golesVisitante--;
            descripcion = "El árbitro " + arbitro.nombre + " expulsó injustamente a un jugador de " + resultado.visitante + ", que se desmoronó.";
        } else if (!favoreceLocal && golesLocal > 0 && Math.random() < 0.5) {
            golesLocal--;
            descripcion = "El árbitro " + arbitro.nombre + " expulsó injustamente a un jugador de " + resultado.local + ", que se desmoronó.";
        } else {
            return { ...resultado, incidencia: null };
        }
    }

    return {
        local: resultado.local,
        visitante: resultado.visitante,
        golesLocal: golesLocal,
        golesVisitante: golesVisitante,
        incidencia: {
            arbitro: arbitro.nombre,
            descripcion: descripcion,
            tipo: tipo
        }
    };
}

// -----------------------------
// SANCIONES Y RECUPERACIÓN DE ÁRBITROS
// -----------------------------

function sancionarArbitro(idArbitro) {
    // Buscamos en todas las ligas
    Object.keys(ARBITROS).forEach(function(ligaId) {
        const arb = ARBITROS[ligaId].find(function(a) { return a.id === idArbitro; });
        if (arb) {
            arb.sancionado = true;
            arb.fechasSancion = 5; // 5 fechas sin dirigir
            arb.nivel = Math.max(40, arb.nivel - 5); // baja nivel
        }
    });
}

function procesarFechasSancion() {
    Object.keys(ARBITROS).forEach(function(ligaId) {
        ARBITROS[ligaId].forEach(function(arb) {
            if (arb.sancionado) {
                arb.fechasSancion--;
                if (arb.fechasSancion <= 0) {
                    arb.sancionado = false;
                    arb.fechasSancion = 0;
                }
            } else {
                // Recuperación gradual de nivel
                if (arb.incidencias > 0 && Math.random() < 0.15) {
                    arb.incidencias = Math.max(0, arb.incidencias - 1);
                }
            }
        });
    });
}

// -----------------------------
// RANKING DE ÁRBITROS
// -----------------------------

function obtenerRankingArbitros(ligaId) {
    const arbitros = ARBITROS[ligaId].slice();

    // Confiabilidad = nivel - (incidencias * 2)
    arbitros.forEach(function(a) {
        a.confiabilidad = a.nivel - (a.incidencias * 2);
    });

    arbitros.sort(function(a, b) {
        return b.confiabilidad - a.confiabilidad;
    });

    return arbitros;
}

// Devuelve los 3 mejores árbitros disponibles (no sancionados)
function obtenerArbitrosParaClasico(ligaId) {
    const ranking = obtenerRankingArbitros(ligaId);
    return ranking.filter(function(a) { return !a.sancionado; }).slice(0, 3);
}

// -----------------------------
// ¿ES UN CLÁSICO?
// -----------------------------

const CLASICOS = [
    [1, 2],    // River - Boca
    [3, 4],    // Racing - Independiente
    [5, 14],   // San Lorenzo - Argentinos
    [8, 9],    // Central - Newell's
    [6, 12],   // Estudiantes - Gimnasia
    [13, 15]   // Lanús - Banfield
];

function esClasico(idA, idB) {
    return CLASICOS.some(function(par) {
        return (par[0] === idA && par[1] === idB) || (par[0] === idB && par[1] === idA);
    });
}

// -----------------------------
// HISTORIAL DE INCIDENCIAS
// -----------------------------

const incidenciasHistoricas = [];

function registrarIncidencia(partido, incidencia, ligaId) {
    incidenciasHistoricas.push({
        arbitro: incidencia.arbitro,
        descripcion: incidencia.descripcion,
        tipo: incidencia.tipo,
        liga: LIGAS[ligaId].nombre,
        local: partido.local,
        visitante: partido.visitante,
        anio: presidente.anioMandato
    });
}

// -----------------------------
// VAR: COSTOS Y EFECTOS
// -----------------------------

const COSTO_VAR_INICIAL = 2000;
const COSTO_VAR_ANUAL = 500;

function activarVAR() {
    if (presidente.dineroEnCaja < COSTO_VAR_INICIAL) return false;
    ajustarDinero(-COSTO_VAR_INICIAL);
    presidente.varActivo = true;
    return true;
}

function desactivarVAR() {
    presidente.varActivo = false;
}

function cobrarVARAnual() {
    if (presidente.varActivo) {
        ajustarDinero(-COSTO_VAR_ANUAL);
    }
}