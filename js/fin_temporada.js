// ============================================
// FIN DE TEMPORADA: balance, reelección y reinicio
// ============================================

// Guardamos los valores al inicio del año para calcular el balance
let valoresInicioAnio = {
    apoyo: 50,
    prestigio: 50,
    dinero: 10000
};

function guardarInicioAnio() {
    valoresInicioAnio.apoyo = presidente.apoyoClubes;
    valoresInicioAnio.prestigio = presidente.prestigioInternacional;
    valoresInicioAnio.dinero = presidente.dineroEnCaja;
}

function calcularBalance() {
    return {
        apoyo: presidente.apoyoClubes - valoresInicioAnio.apoyo,
        prestigio: presidente.prestigioInternacional - valoresInicioAnio.prestigio,
        dinero: presidente.dineroEnCaja - valoresInicioAnio.dinero,
        decisiones: presidente.historialDecisiones.length
    };
}

function evaluarMandato() {
    const apoyo = presidente.apoyoClubes;
    if (apoyo >= 65) return { tipo: "exito", titulo: "¡Reelección arrasadora!" };
    if (apoyo >= 55) return { tipo: "ok", titulo: "Reelegido por los clubes" };
    if (apoyo >= 40) return { tipo: "mal", titulo: "No te reeligen" };
    return { tipo: "desastre", titulo: "Te echan con escándalo" };
}

// -----------------------------
// MOSTRAR FIN DE TEMPORADA
// -----------------------------

function mostrarFinDeTemporada() {
    const balance = calcularBalance();
    const evaluacion = evaluarMandato();

    const movimientos = aplicarAscensosYDescensos();

    let mensajeFinal = "";
    let textoBoton = "";
    let accionBoton = null;

    if (evaluacion.tipo === "exito" || evaluacion.tipo === "ok") {
        mensajeFinal = "Los clubes confían en vos. <strong>Te reeligen para un nuevo mandato.</strong>";
        textoBoton = "Comenzar Año " + (presidente.anioMandato + 1);
        accionBoton = function() {
            cerrarModalFin();
            presidente.anioMandato++;
            if (presidente.anioMandato > presidente.anioMaximo) {
                mostrarVictoriaFinal();
            } else {
                iniciarNuevaTemporada();
            }
        };
    } else {
        mensajeFinal = "Los clubes perdieron la confianza en tu gestión. <strong>Tu mandato termina acá.</strong>";
        textoBoton = "Volver a empezar";
        accionBoton = function() {
            location.reload();
        };
    }

    renderizarFinDeTemporada({
        titulo: evaluacion.titulo,
        balance: balance,
        movimientos: movimientos,
        mensajeFinal: mensajeFinal,
        textoBoton: textoBoton,
        accionBoton: accionBoton
    });

    document.getElementById("modal-fin").classList.remove("modal-oculto");

    // Sonido de éxito o fracaso según el resultado
    if (evaluacion.tipo === "exito" || evaluacion.tipo === "ok") {
        sonidoExito();
    } else {
        sonidoFracaso();
    }
}

function cerrarModalFin() {
    document.getElementById("modal-fin").classList.add("modal-oculto");
}

// -----------------------------
// VICTORIA FINAL
// -----------------------------

function mostrarVictoriaFinal() {
    renderizarFinDeTemporada({
        titulo: "🏆 ¡Completaste tu mandato!",
        balance: {
            apoyo: presidente.apoyoClubes - valoresInicioAnio.apoyo,
            prestigio: presidente.prestigioInternacional - valoresInicioAnio.prestigio,
            dinero: presidente.dineroEnCaja - valoresInicioAnio.dinero,
            decisiones: presidente.historialDecisiones.length
        },
        movimientos: null,
        mensajeFinal:
            "<p>Gobernaste la AFA por " + presidente.anioMaximo + " años. " +
            "Tu legado quedará en la historia del fútbol argentino.</p>" +
            "<p><strong>Apoyo final:</strong> " + presidente.apoyoClubes + "<br>" +
            "<strong>Prestigio final:</strong> " + presidente.prestigioInternacional + "<br>" +
            "<strong>Caja final:</strong> $" + presidente.dineroEnCaja + "M</p>",
        textoBoton: "Jugar de nuevo",
        accionBoton: function() {
            borrarPartida();
            location.reload();
        }
    });

    document.getElementById("modal-fin").classList.remove("modal-oculto");
    sonidoLogro();
}

// -----------------------------
// INICIAR NUEVA TEMPORADA (Año 2, 3, 4...)
// -----------------------------

function iniciarNuevaTemporada() {
    // 1) Reset del estado de las ligas
    estadoLigas.fechaActual = 0;
    estadoLigas.resultados = {};
    estadoLigas.calendarios = {};
    estadoLigas.tablas = {};

    // 2) Evolución de la fuerza de los equipos
    resetearLigasParaNuevaTemporada();

    // 3) Reinicializar tablas y calendarios con la nueva estructura
    inicializarTablas();
    generarTodosLosCalendarios();

    // 4) Reset del visor de fechas
    fechaVisorActual = 0;

    // 5) Reset del historial de amistosos
    historialAmistosos.length = 0;

    // 6) Reactivar botón de avanzar
    const boton = document.getElementById("btn-avanzar");
    boton.disabled = false;
    boton.textContent = "Avanzar fecha ▶";

    // 7) Cobrar ingresos del nuevo año
    cobrarIngresosAnuales();

    // 8) Resetear sponsor actual para firmar uno nuevo
    estadoFinanzas.sponsorActual = null;

    // 9) Guardar valores del nuevo año
    guardarInicioAnio();

    // 10) Refrescar toda la interfaz
    renderizarTablasTodasLasLigas();
    renderizarVisorResultados();
    actualizarTituloFecha();
    actualizarBotonAvanzar();
    renderizarPanelPresidente();
    renderizarArbitros();
    renderizarFinanzas();
    renderizarSeleccion();
    renderizarCopa();
    renderizarRankingFifa();
    renderizarContinentales();
    renderizarNoticias();
    renderizarDecisionesRecientes();
    renderizarEncuesta();

    // 11) Guardar y abrir modal de sponsors para el nuevo año
    guardarPartida();

    setTimeout(function() {
        const ofertas = generarOfertasSponsors();
        mostrarModalSponsors(ofertas);
    }, 300);
}