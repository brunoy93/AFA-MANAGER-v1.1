// ============================================
// GUARDADO: persistencia con localStorage
// ============================================

const CLAVE_GUARDADO = "afa_manager_partida_v1";

// -----------------------------
// GUARDAR
// -----------------------------

function guardarPartida() {
    try {
        const datos = {
            version: 1,
            fecha: new Date().toISOString(),

            // Presidente
            presidente: {
                anioMandato: presidente.anioMandato,
                apoyoClubes: presidente.apoyoClubes,
                prestigioInternacional: presidente.prestigioInternacional,
                dineroEnCaja: presidente.dineroEnCaja,
                seleccionador: presidente.seleccionador,
                varActivo: presidente.varActivo,
                historialDecisiones: presidente.historialDecisiones
            },

            // Estado de ligas
            estadoLigas: {
                fechaActual: estadoLigas.fechaActual,
                totalFechas: estadoLigas.totalFechas,
                calendarios: estadoLigas.calendarios,
                resultados: estadoLigas.resultados,
                tablas: estadoLigas.tablas
            },

            // Equipos
            equipos: EQUIPOS,
            proximoIdEquipo: proximoIdEquipo,
            ligasEstructura: {
                primera: { equipos: LIGAS.primera.equipos },
                nacional: { equipos: LIGAS.nacional.equipos },
                federalA: { equipos: LIGAS.federalA.equipos }
            },

            // Finanzas
            estadoFinanzas: {
                sponsorActual: estadoFinanzas.sponsorActual,
                ingresosDelAnio: estadoFinanzas.ingresosDelAnio,
                egresosDelAnio: estadoFinanzas.egresosDelAnio,
                historial: estadoFinanzas.historial,
                eventosDelAnio: estadoFinanzas.eventosDelAnio,
                rescates: estadoFinanzas.rescates,
                nivelDeuda: estadoFinanzas.nivelDeuda
            },

            // Selección
            historialAmistosos: historialAmistosos,
            copaActual: copaActual,
            historialContinentales: historialContinentales,

            // Ranking
            ranking: {
                puesto: ESTADO_RANKING.puesto,
                historial: ESTADO_RANKING.historial
            },

            // Noticias e historiales
            noticiasHistoricas: noticiasHistoricas,
            incidenciasHistoricas: incidenciasHistoricas,
            encuestasHistoricas: encuestasHistoricas,
            eventosHistoricos: eventosHistoricos,

            // Diseño de árbitros ya designados
            designacionesPorFecha: designacionesPorFecha,

            // Variables de control
            dtElegido: dtElegido,
            valoresInicioAnio: valoresInicioAnio,

            // Fecha del visor
            fechaVisorActual: fechaVisorActual,

            // Sonido
            sonidoActivado: sonidoActivado
        };

        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(datos));
        return true;
    } catch (e) {
        console.error("Error al guardar:", e);
        return false;
    }
}

// -----------------------------
// CARGAR
// -----------------------------

function hayPartidaGuardada() {
    return localStorage.getItem(CLAVE_GUARDADO) !== null;
}

function infoPartidaGuardada() {
    try {
        const raw = localStorage.getItem(CLAVE_GUARDADO);
        if (!raw) return null;
        const datos = JSON.parse(raw);
        return {
            fecha: datos.fecha,
            anioMandato: datos.presidente.anioMandato,
            fechaLiga: datos.estadoLigas.fechaActual,
            seleccionador: datos.presidente.seleccionador
        };
    } catch (e) {
        return null;
    }
}

function cargarPartida() {
    try {
        const raw = localStorage.getItem(CLAVE_GUARDADO);
        if (!raw) return false;

        const datos = JSON.parse(raw);

        // Presidente
        presidente.anioMandato = datos.presidente.anioMandato;
        presidente.apoyoClubes = datos.presidente.apoyoClubes;
        presidente.prestigioInternacional = datos.presidente.prestigioInternacional;
        presidente.dineroEnCaja = datos.presidente.dineroEnCaja;
        presidente.seleccionador = datos.presidente.seleccionador;
        presidente.varActivo = datos.presidente.varActivo;
        presidente.historialDecisiones = datos.presidente.historialDecisiones || [];

        // Estado de ligas
        estadoLigas.fechaActual = datos.estadoLigas.fechaActual;
        estadoLigas.totalFechas = datos.estadoLigas.totalFechas;
        estadoLigas.calendarios = datos.estadoLigas.calendarios;
        estadoLigas.resultados = datos.estadoLigas.resultados;
        estadoLigas.tablas = datos.estadoLigas.tablas;

        // Equipos (reemplazamos por los guardados)
        Object.keys(datos.equipos).forEach(function(id) {
            EQUIPOS[id] = datos.equipos[id];
        });
        proximoIdEquipo = datos.proximoIdEquipo || 104;

        // Estructura de ligas
        LIGAS.primera.equipos = datos.ligasEstructura.primera.equipos;
        LIGAS.nacional.equipos = datos.ligasEstructura.nacional.equipos;
        LIGAS.federalA.equipos = datos.ligasEstructura.federalA.equipos;

        // Finanzas
        estadoFinanzas.sponsorActual = datos.estadoFinanzas.sponsorActual;
        estadoFinanzas.ingresosDelAnio = datos.estadoFinanzas.ingresosDelAnio;
        estadoFinanzas.egresosDelAnio = datos.estadoFinanzas.egresosDelAnio;
        estadoFinanzas.historial = datos.estadoFinanzas.historial || [];
        estadoFinanzas.eventosDelAnio = datos.estadoFinanzas.eventosDelAnio || [];
        estadoFinanzas.rescates = datos.estadoFinanzas.rescates || {};
        estadoFinanzas.nivelDeuda = datos.estadoFinanzas.nivelDeuda || {};

        // Selección
        historialAmistosos.length = 0;
        (datos.historialAmistosos || []).forEach(function(a) {
            historialAmistosos.push(a);
        });

        copaActual = datos.copaActual || null;

        historialContinentales.length = 0;
        (datos.historialContinentales || []).forEach(function(c) {
            historialContinentales.push(c);
        });

        // Ranking
        ESTADO_RANKING.puesto = datos.ranking.puesto;
        ESTADO_RANKING.historial = datos.ranking.historial || [];

        // Noticias e historiales
        noticiasHistoricas.length = 0;
        (datos.noticiasHistoricas || []).forEach(function(n) {
            noticiasHistoricas.push(n);
        });

        incidenciasHistoricas.length = 0;
        (datos.incidenciasHistoricas || []).forEach(function(i) {
            incidenciasHistoricas.push(i);
        });

        encuestasHistoricas.length = 0;
        (datos.encuestasHistoricas || []).forEach(function(e) {
            encuestasHistoricas.push(e);
        });

        eventosHistoricos.length = 0;
        (datos.eventosHistoricos || []).forEach(function(e) {
            eventosHistoricos.push(e);
        });

        // Designaciones de árbitros
        Object.keys(designacionesPorFecha).forEach(function(k) {
            delete designacionesPorFecha[k];
        });
        Object.keys(datos.designacionesPorFecha || {}).forEach(function(k) {
            designacionesPorFecha[k] = datos.designacionesPorFecha[k];
        });

        // Variables de control
        dtElegido = datos.dtElegido || false;
        valoresInicioAnio = datos.valoresInicioAnio || valoresInicioAnio;
        fechaVisorActual = datos.fechaVisorActual || 0;

        // Sonido
        if (typeof datos.sonidoActivado !== "undefined") {
            sonidoActivado = datos.sonidoActivado;
        }

        return true;
    } catch (e) {
        console.error("Error al cargar:", e);
        return false;
    }
}

// -----------------------------
// BORRAR
// -----------------------------

function borrarPartida() {
    localStorage.removeItem(CLAVE_GUARDADO);
}