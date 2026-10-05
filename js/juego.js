// ============================================
// JUEGO: el director de orquesta
// ============================================

let dtElegido = false;
let incidenciaPendiente = null;
let eventoPendiente = null;
let conferenciaPendiente = null;
let partidaYaIniciada = false;
let clasicoPendiente = null;

// Intervalos (temporada de ~36 fechas)
const CADA_DECISION = 6;
const CADA_ENCUESTA = 12;
const CADA_EVENTO = 10;
const CADA_CONFERENCIA = 18;
const PROBABILIDAD_EVENTO = 0.8;

window.addEventListener("DOMContentLoaded", function() {
    if (hayPartidaGuardada()) {
        const info = infoPartidaGuardada();
        mostrarBienvenida(info);
    } else {
        iniciarPartidaNueva();
    }
    conectarBotonesHeader();
});

function conectarBotonesHeader() {
    document.getElementById("btn-mute").addEventListener("click", function() {
        toggleMute();
    });

    document.getElementById("btn-nueva-partida").addEventListener("click", function() {
        if (confirm("¿Seguro que querés empezar una nueva partida? Se perderá el progreso actual.")) {
            borrarPartida();
            location.reload();
        }
    });
}

window.iniciarPartidaNueva = function() {
    inicializarEquipos();
    inicializarTablas();
    generarTodosLosCalendarios();
    asignarDeudasIniciales();

    conectarPestanias();
    refrescarTodo();

    guardarInicioAnio();

    document.getElementById("btn-avanzar").addEventListener("click", manejarAvanceFecha);
    conectarBotonesVAR();

    document.getElementById("btn-avanzar").disabled = true;
    mostrarIntro();

    document.getElementById("btn-intro-continuar").addEventListener("click", function() {
        sonidoClick();
        cerrarIntro();
        mostrarEleccionDT();
    });

    partidaYaIniciada = true;
    actualizarBotonMute();
};

window.iniciarPartidaGuardada = function() {
    const cargado = cargarPartida();
    if (!cargado) {
        alert("Error al cargar. Empezando una partida nueva.");
        iniciarPartidaNueva();
        return;
    }

    conectarPestanias();
    refrescarTodo();

    document.getElementById("btn-avanzar").addEventListener("click", manejarAvanceFecha);
    conectarBotonesVAR();

    if (!dtElegido) {
        document.getElementById("btn-avanzar").disabled = true;
        mostrarIntro();
        document.getElementById("btn-intro-continuar").addEventListener("click", function() {
            sonidoClick();
            cerrarIntro();
            mostrarEleccionDT();
        });
    }

    partidaYaIniciada = true;
    actualizarBotonMute();
    renderizarEncuesta();
};

function conectarBotonesVAR() {
    document.getElementById("btn-var-activar").addEventListener("click", function() {
        sonidoClick();
        const exito = activarVAR();
        cerrarModalVAR();
        renderizarPanelPresidente();
        renderizarArbitros();

        if (!exito) {
            alert("No hay dinero suficiente para activar el VAR.");
            return;
        }

        noticiaDeVAR(true);

        setTimeout(function() {
            const ofertas = generarOfertasSponsors();
            mostrarModalSponsors(ofertas);
        }, 300);
    });

    document.getElementById("btn-var-rechazar").addEventListener("click", function() {
        sonidoClick();
        cerrarModalVAR();
        noticiaDeVAR(false);

        setTimeout(function() {
            const ofertas = generarOfertasSponsors();
            mostrarModalSponsors(ofertas);
        }, 300);
    });
}

function refrescarTodo() {
    renderizarTablasTodasLasLigas();
    renderizarVisorResultados();
    actualizarTituloFecha();
    actualizarBotonAvanzar();
    renderizarPanelPresidente();
    renderizarArbitros();
    renderizarFinanzas();
    renderizarRankingFifa();
    renderizarSeleccion();
    renderizarCopa();
    renderizarContinentales();
    renderizarNoticias();
    renderizarDecisionesRecientes();
    renderizarEncuesta();
}

function desbloquearJuego() {
    dtElegido = true;
    document.getElementById("btn-avanzar").disabled = false;
    noticiasDeBienvenida();
    guardarPartida();
}

// -----------------------------
// AVANZAR UNA FECHA
// -----------------------------

function manejarAvanceFecha() {
    if (!dtElegido) return;

    // 1) Antes de simular, chequeamos si hay un clásico sin árbitro asignado
    const clasico = buscarClasicoSinArbitro();

    if (clasico) {
        clasicoPendiente = clasico;
        mostrarModalDesignacion(
            clasico.ligaId,
            clasico.numeroFecha,
            clasico.indicePartido,
            clasico.nombreLocal,
            clasico.nombreVisitante,
            function() {
                clasicoPendiente = null;
                ejecutarAvanceFecha();
            }
        );
        return;
    }

    ejecutarAvanceFecha();
}

function buscarClasicoSinArbitro() {
    const ligaId = "primera";
    const numeroFecha = estadoLigas.fechaActual;

    const calendario = estadoLigas.calendarios[ligaId];
    if (!calendario || numeroFecha >= calendario.length) return null;

    const fecha = calendario[numeroFecha];

    for (let i = 0; i < fecha.length; i++) {
        const partido = fecha[i];
        if (esClasico(partido.local, partido.visitante)) {
            const clave = clavePartido(ligaId, numeroFecha, i);
            if (!designacionesPorFecha[clave]) {
                const eqLocal = EQUIPOS[partido.local];
                const eqVisitante = EQUIPOS[partido.visitante];
                return {
                    ligaId: ligaId,
                    numeroFecha: numeroFecha,
                    indicePartido: i,
                    nombreLocal: eqLocal.nombre,
                    nombreVisitante: eqVisitante.nombre
                };
            }
        }
    }
    return null;
}

// -----------------------------
// EJECUTAR EL AVANCE REAL
// -----------------------------

function ejecutarAvanceFecha() {
    sonidoAvanzar();

    procesarFechasSancion();

    jugarFechaTodasLasLigas();
    detectarIncidenciaEnClasico();

    renderizarTablasTodasLasLigas();
    renderizarVisorResultados();
    actualizarTituloFecha();
    actualizarBotonAvanzar();
    renderizarPanelPresidente();
    renderizarArbitros();
    renderizarFinanzas();
    renderizarDecisionesRecientes();

    // Amistosos: 4 por temporada
    const total = estadoLigas.totalFechas;
    const fechasAmistoso = [
        Math.round(total * 0.2),
        Math.round(total * 0.4),
        Math.round(total * 0.6),
        Math.round(total * 0.8)
    ];

    if (fechasAmistoso.includes(estadoLigas.fechaActual)) {
        if (presidente.seleccionador) {
            simularAmistoso();
            renderizarSeleccion();
            renderizarRankingFifa();
        }
    }

    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) {
        manejarFinDeTemporada();
        guardarPartida();
        return;
    }

    // Decisiones: cada 6 fechas
    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % CADA_DECISION === 0) {
        const idsUsados = presidente.historialDecisiones.map(function(d) {
            const encontrada = DECISIONES.find(function(dec) {
                return dec.titulo === d.decision;
            });
            return encontrada ? encontrada.id : null;
        });

        const decision = obtenerDecisionDisponible(idsUsados);
        if (decision) {
            mostrarDecision(decision);
        }
    }

    // Encuestas: cada 12 fechas
    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % CADA_ENCUESTA === 0) {
        generarEncuesta();
        renderizarEncuesta();
        renderizarNoticias();
        renderizarPanelPresidente();
    }

    // Conferencias: cada 18 fechas
    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % CADA_CONFERENCIA === 0) {
        conferenciaPendiente = generarConferencia();
    }

    // Eventos: cada 10 fechas con 80%
    if (estadoLigas.fechaActual > 0 &&
        estadoLigas.fechaActual % CADA_EVENTO === 0 &&
        Math.random() < PROBABILIDAD_EVENTO) {
        eventoPendiente = generarEvento();
    }

    guardarPartida();

    // ---- Prioridad de modales ----
    // 1) Incidencia en clásico (lo más grave)
    if (incidenciaPendiente) {
        const inc = incidenciaPendiente;
        incidenciaPendiente = null;

        noticiaDeIncidencia(inc.incidencia, inc.partido);
        renderizarNoticias();

        setTimeout(function() {
            mostrarModalIncidencia(inc.incidencia, inc.partido);
        }, 500);
        return;
    }

    // 2) Conferencia de prensa
    if (conferenciaPendiente) {
        const conf = conferenciaPendiente;
        conferenciaPendiente = null;

        setTimeout(function() {
            mostrarConferenciaPrensa(conf);
        }, 500);
        return;
    }

    // 3) Evento aleatorio
    if (eventoPendiente) {
        const ev = eventoPendiente;
        eventoPendiente = null;

        setTimeout(function() {
            if (ev.automatico) {
                ev.efecto();
                registrarEvento(ev, "Automático");
                mostrarModalEventoAutomatico(ev);
                renderizarPanelPresidente();
                renderizarFinanzas();
                renderizarNoticias();
            } else {
                mostrarModalEvento(ev);
            }
        }, 500);
    }
}

// -----------------------------
// FIN DE TEMPORADA
// -----------------------------

function manejarFinDeTemporada() {
    if (presidente.anioMandato === 1 || presidente.anioMandato === 3) {
        simularCopa();
        renderizarCopa();
        renderizarRankingFifa();
        renderizarPanelPresidente();
        noticiaDeCopa(copaActual.posicionArgentina);

        if (copaActual.posicionArgentina === "campeon") sonidoLogro();
        else if (copaActual.posicionArgentina === "grupos") sonidoFracaso();
    }

    simularContinentales();
    renderizarContinentales();
    renderizarPanelPresidente();

    cobrarVARAnual();
    cobrarEgresosAnuales();
    empeorarDeudasAlCierre();
    cerrarAnioFinanciero();

    const campPrimera = obtenerTablaOrdenada("primera")[0].nombre;
    const campNacional = obtenerTablaOrdenada("nacional")[0].nombre;
    const campFederalA = obtenerTablaOrdenada("federalA")[0].nombre;
    noticiasDeFinDeTemporada(campPrimera, campNacional, campFederalA);

    renderizarPanelPresidente();
    renderizarFinanzas();
    renderizarNoticias();

    mostrarFinDeTemporada();
}

// -----------------------------
// DETECTAR INCIDENCIA EN CLÁSICO
// -----------------------------

function detectarIncidenciaEnClasico() {
    const ligaId = "primera";
    const resultadosLiga = estadoLigas.resultados[ligaId];
    if (!resultadosLiga || resultadosLiga.length === 0) return;

    const ultimaFechaResultados = resultadosLiga[resultadosLiga.length - 1];
    const calendarioLiga = estadoLigas.calendarios[ligaId];
    const numeroFecha = estadoLigas.fechaActual - 1;
    const fechaCalendario = calendarioLiga[numeroFecha];
    if (!fechaCalendario) return;

    ultimaFechaResultados.forEach(function(r, indice) {
        if (!r.incidencia) return;

        const partido = fechaCalendario[indice];
        if (!partido) return;

        if (esClasico(partido.local, partido.visitante)) {
            incidenciaPendiente = {
                incidencia: r.incidencia,
                partido: { local: r.local, visitante: r.visitante }
            };
        }
    });
}