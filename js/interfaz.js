// ============================================
// INTERFAZ: cómo se dibuja todo en pantalla
// ============================================

let fechaVisorActual = 0;

// -----------------------------
// SISTEMA DE PESTAÑAS
// -----------------------------

function cambiarPestania(nombre) {
    document.querySelectorAll(".pestania-contenido").forEach(function(p) {
        p.classList.remove("activa");
    });
    document.querySelectorAll(".pestania").forEach(function(b) {
        b.classList.remove("activa");
    });

    const contenido = document.getElementById("pestania-" + nombre);
    if (contenido) contenido.classList.add("activa");

    const boton = document.querySelector(".pestania[data-pestania='" + nombre + "']");
    if (boton) boton.classList.add("activa");

    sonidoPestania();
}

function conectarPestanias() {
    document.querySelectorAll(".pestania").forEach(function(boton) {
        boton.addEventListener("click", function() {
            const nombre = this.dataset.pestania;
            cambiarPestania(nombre);
        });
    });
}

// -----------------------------
// MODAL DE BIENVENIDA
// -----------------------------

function mostrarBienvenida(infoPartida) {
    const texto = document.getElementById("bienvenida-texto");
    const opciones = document.getElementById("bienvenida-opciones");
    opciones.innerHTML = "";

    if (infoPartida) {
        const fecha = new Date(infoPartida.fecha).toLocaleDateString("es-AR");
        texto.innerHTML =
            "Hay una partida guardada.<br><br>" +
            "<strong>Año " + infoPartida.anioMandato + "</strong> · Fecha " + (infoPartida.fechaLiga + 1) + "<br>" +
            "<strong>DT:</strong> " + (infoPartida.seleccionador || "sin elegir") + "<br>" +
            "<strong>Guardada el:</strong> " + fecha;

        const btnContinuar = document.createElement("button");
        btnContinuar.className = "opcion-decision";
        btnContinuar.innerHTML =
            "<strong>Continuar partida</strong>" +
            "<span class='opcion-resumen'>Retomar donde la dejaste</span>";
        btnContinuar.addEventListener("click", function() {
            sonidoClick();
            cerrarBienvenida();
            window.iniciarPartidaGuardada();
        });
        opciones.appendChild(btnContinuar);

        const btnNueva = document.createElement("button");
        btnNueva.className = "opcion-decision";
        btnNueva.innerHTML =
            "<strong>Nueva partida</strong>" +
            "<span class='opcion-resumen'>Empezar de cero (borra la partida guardada)</span>";
        btnNueva.addEventListener("click", function() {
            sonidoClick();
            if (confirm("¿Seguro? Se borrará la partida guardada.")) {
                borrarPartida();
                cerrarBienvenida();
                window.iniciarPartidaNueva();
            }
        });
        opciones.appendChild(btnNueva);
    } else {
        texto.innerHTML = "No hay partidas guardadas. Comenzando una nueva partida...";
        const btnEmpezar = document.createElement("button");
        btnEmpezar.className = "opcion-decision";
        btnEmpezar.innerHTML = "<strong>Comenzar</strong>";
        btnEmpezar.addEventListener("click", function() {
            sonidoClick();
            cerrarBienvenida();
            window.iniciarPartidaNueva();
        });
        opciones.appendChild(btnEmpezar);
    }

    document.getElementById("modal-bienvenida").classList.remove("modal-oculto");
}

function cerrarBienvenida() {
    document.getElementById("modal-bienvenida").classList.add("modal-oculto");
}

// -----------------------------
// TÍTULO DE FECHA Y BOTÓN
// -----------------------------

function actualizarTituloFecha() {
    const titulo = document.getElementById("titulo-fecha");
    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) {
        titulo.textContent = "¡Temporada terminada!";
    } else {
        titulo.textContent = "Fecha " + (estadoLigas.fechaActual + 1) + " / " + estadoLigas.totalFechas;
    }

    document.title = "AFA Manager · Año " + presidente.anioMandato +
        " · Fecha " + (estadoLigas.fechaActual + 1);
}

function actualizarBotonAvanzar() {
    const boton = document.getElementById("btn-avanzar");
    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) {
        boton.disabled = true;
        boton.textContent = "Temporada finalizada";
    } else {
        boton.disabled = false;
        boton.textContent = "Avanzar fecha ▶";
    }
}

// -----------------------------
// PANEL DEL PRESIDENTE
// -----------------------------

function renderizarPanelPresidente() {
    document.getElementById("pres-anio").textContent =
        presidente.anioMandato + " / " + presidente.anioMaximo;
    document.getElementById("pres-apoyo").textContent =
        presidente.apoyoClubes;
    document.getElementById("pres-prestigio").textContent =
        presidente.prestigioInternacional;
    document.getElementById("pres-dinero").textContent =
        "$" + presidente.dineroEnCaja.toLocaleString() + "M";
}

// -----------------------------
// TABLAS DE LAS 3 LIGAS
// -----------------------------

function renderizarTablasTodasLasLigas() {
    const contenedor = document.getElementById("tabla");
    if (!contenedor) return;

    contenedor.innerHTML = "<h2>Tablas de posiciones</h2>";

    Object.keys(LIGAS).forEach(function(ligaId) {
        const liga = LIGAS[ligaId];
        const tabla = obtenerTablaOrdenada(ligaId);

        const div = document.createElement("div");
        div.style.marginBottom = "30px";

        let html = "<h3 style='color:#4ade80;margin-bottom:10px'>" + liga.nombre + "</h3>";
        html += "<table><thead><tr>";
        html += "<th>#</th><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th>";
        html += "</tr></thead><tbody>";

        tabla.forEach(function(eq, i) {
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td class='celda-equipo'>" +
                        htmlEscudo(eq.id, eq.nombre, 24) +
                        "<span class='nombre-equipo-tabla'>" + eq.nombre + "</span>" +
                    "</td>";
            html += "<td>" + eq.PJ + "</td>";
            html += "<td>" + eq.G + "</td>";
            html += "<td>" + eq.E + "</td>";
            html += "<td>" + eq.P + "</td>";
            html += "<td>" + eq.GF + "</td>";
            html += "<td>" + eq.GC + "</td>";
            html += "<td>" + eq.DG + "</td>";
            html += "<td><strong>" + eq.Pts + "</strong></td>";
            html += "</tr>";
        });

        html += "</tbody></table>";
        div.innerHTML = html;
        contenedor.appendChild(div);
    });
}

// -----------------------------
// VISOR DE RESULTADOS
// -----------------------------

function renderizarVisorResultados() {
    const contenedor = document.getElementById("lista-resultados");
    if (!contenedor) return;

    const totalJugadas = estadoLigas.fechaActual;

    let html = "";

    html += "<div class='visor-controles'>";
    html += "<button id='btn-fecha-prev' class='btn-nav' " + (fechaVisorActual <= 0 ? "disabled" : "") + ">◀</button>";
    html += "<span class='visor-fecha-titulo'>Fecha " + (fechaVisorActual + 1) + " / " + estadoLigas.totalFechas + "</span>";
    html += "<button id='btn-fecha-next' class='btn-nav' " + (fechaVisorActual >= totalJugadas - 1 ? "disabled" : "") + ">▶</button>";
    html += "<button id='btn-fecha-ultima' class='btn-nav btn-nav-texto'>Última jugada</button>";
    html += "</div>";

    if (fechaVisorActual >= totalJugadas) {
        html += "<p class='visor-vacio'>Esta fecha todavía no se jugó.</p>";
        contenedor.innerHTML = html;
        conectarBotonesVisor();
        return;
    }

    Object.keys(LIGAS).forEach(function(ligaId) {
        const liga = LIGAS[ligaId];
        const resultadosLiga = estadoLigas.resultados[ligaId];

        if (!resultadosLiga || fechaVisorActual >= resultadosLiga.length) return;

        const resultadosFecha = resultadosLiga[fechaVisorActual];
        const calendarioLiga = estadoLigas.calendarios[ligaId];
        const fechaCalendario = calendarioLiga[fechaVisorActual] || [];

        html += "<div class='visor-liga'>";
        html += "<h4 class='visor-liga-titulo'>" + liga.nombre + "</h4>";

        resultadosFecha.forEach(function(r, indice) {
            const partido = fechaCalendario[indice];
            const idLocal = partido ? partido.local : null;
            const idVisitante = partido ? partido.visitante : null;

            html += "<div class='resultado-partido'>";
            html += "<span class='res-local'>" +
                        (idLocal ? htmlEscudo(idLocal, r.local, 22) : "") +
                        "<span class='res-nombre'>" + r.local + "</span>" +
                    "</span>";
            html += "<span class='res-marcador'>" + r.golesLocal + " - " + r.golesVisitante + "</span>";
            html += "<span class='res-visitante'>" +
                        "<span class='res-nombre'>" + r.visitante + "</span>" +
                        (idVisitante ? htmlEscudo(idVisitante, r.visitante, 22) : "") +
                    "</span>";

            if (r.incidencia) {
                html += "<div class='incidencia-partido'>⚖️ " + r.incidencia.descripcion + "</div>";
            }

            html += "</div>";
        });

        html += "</div>";
    });

    contenedor.innerHTML = html;
    conectarBotonesVisor();
}

function conectarBotonesVisor() {
    const btnPrev = document.getElementById("btn-fecha-prev");
    const btnNext = document.getElementById("btn-fecha-next");
    const btnUltima = document.getElementById("btn-fecha-ultima");

    if (btnPrev) {
        btnPrev.addEventListener("click", function() {
            if (fechaVisorActual > 0) {
                fechaVisorActual--;
                sonidoClick();
                renderizarVisorResultados();
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", function() {
            if (fechaVisorActual < estadoLigas.fechaActual - 1) {
                fechaVisorActual++;
                sonidoClick();
                renderizarVisorResultados();
            }
        });
    }

    if (btnUltima) {
        btnUltima.addEventListener("click", function() {
            fechaVisorActual = Math.max(0, estadoLigas.fechaActual - 1);
            sonidoClick();
            renderizarVisorResultados();
        });
    }
}

// -----------------------------
// SECCIÓN DE ÁRBITROS
// -----------------------------

function renderizarArbitros() {
    const infoVar = document.getElementById("info-var");
    if (infoVar) {
        if (presidente.varActivo) {
            infoVar.className = "var-activo";
            infoVar.innerHTML =
                "<strong>VAR activo</strong>" +
                "<span class='var-etiqueta activo'>Activo</span><br>" +
                "<small>Costo anual: -$" + COSTO_VAR_ANUAL + "M · Errores arbitrales reducidos a la mitad</small>";
        } else {
            infoVar.className = "var-inactivo";
            infoVar.innerHTML =
                "<strong>VAR no implementado</strong>" +
                "<span class='var-etiqueta inactivo'>Inactivo</span><br>" +
                "<small>Los errores arbitrales no se revisan. Se puede activar al cierre de temporada.</small>";
        }
    }

    // Ranking de árbitros
    renderizarRankingArbitros();

    const incidenciasDiv = document.getElementById("incidencias-recientes");
    if (incidenciasDiv) {
        incidenciasDiv.innerHTML = "";

        if (incidenciasHistoricas.length === 0) {
            incidenciasDiv.innerHTML = "<p style='color:#8b9bb0;margin-bottom:15px'>Sin incidencias arbitrales por ahora.</p>";
        } else {
            incidenciasDiv.innerHTML = "<h3 style='color:#c084fc;font-size:0.95em;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px'>Últimas incidencias</h3>";

            const ultimas = incidenciasHistoricas.slice(-5).reverse();
            ultimas.forEach(function(inc) {
                const div = document.createElement("div");
                div.className = "incidencia";
                div.innerHTML =
                    "<div class='inc-titulo'>" + inc.arbitro + " · " + inc.liga + "</div>" +
                    "<div class='inc-desc'>" + inc.descripcion + "</div>" +
                    "<div class='inc-meta'>" + inc.local + " vs " + inc.visitante + " · Año " + inc.anio + "</div>";
                incidenciasDiv.appendChild(div);
            });
        }
    }

    const arbitrosDiv = document.getElementById("lista-arbitros-destacados");
    if (arbitrosDiv) {
        arbitrosDiv.innerHTML = "";

        const titulo = document.createElement("h3");
        titulo.style.cssText = "color:#c084fc;font-size:0.95em;text-transform:uppercase;letter-spacing:1px;margin:15px 0 10px 0;grid-column:1/-1";
        titulo.textContent = "Árbitros de Primera División";
        arbitrosDiv.appendChild(titulo);

        ARBITROS.primera.forEach(function(arb) {
            const card = document.createElement("div");
            card.className = "arbitro-card";
            card.innerHTML =
                "<div class='arb-nombre'>" + arb.nombre + "</div>" +
                "<div class='arb-meta'>" +
                    "<span>Nivel: <span class='arb-nivel'>" + arb.nivel + "</span></span>" +
                    "<span>" + arb.estilo + "</span>" +
                "</div>";
            arbitrosDiv.appendChild(card);
        });
    }
}

// -----------------------------
// RANKING DE ÁRBITROS
// -----------------------------

function renderizarRankingArbitros() {
    const contenedor = document.getElementById("ranking-arbitros");
    if (!contenedor) return;

    const ranking = obtenerRankingArbitros("primera");

    let html = "<h3>🏆 Ranking de confiabilidad</h3>";
    html += "<table class='tabla-ranking-arbitros'>";
    html += "<thead><tr>";
    html += "<th>#</th><th>Árbitro</th><th>Nivel</th><th>Incidencias</th><th>Confiabilidad</th>";
    html += "</tr></thead><tbody>";

    ranking.forEach(function(arb, i) {
        let claseConf = "confiabilidad-media";
        if (arb.confiabilidad >= 75) claseConf = "confiabilidad-alta";
        else if (arb.confiabilidad < 60) claseConf = "confiabilidad-baja";

        const sancionTag = arb.sancionado ? "<span class='arb-sancionado'>Sancionado</span>" : "";

        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + arb.nombre + sancionTag + "</td>";
        html += "<td>" + arb.nivel + "</td>";
        html += "<td class='arb-incidencias'>" + arb.incidencias + "</td>";
        html += "<td class='" + claseConf + "'>" + arb.confiabilidad + "</td>";
        html += "</tr>";
    });

    html += "</tbody></table>";
    contenedor.innerHTML = html;
}

// -----------------------------
// MODAL DE DESIGNACIÓN DE ÁRBITRO (para clásicos)
// -----------------------------

function mostrarModalDesignacion(ligaId, numeroFecha, indicePartido, nombreLocal, nombreVisitante, callback) {
    document.getElementById("designacion-partido").textContent =
        nombreLocal + " vs " + nombreVisitante;

    const contenedor = document.getElementById("designacion-opciones");
    contenedor.innerHTML = "";

    const candidatos = obtenerArbitrosParaClasico(ligaId);

    if (candidatos.length === 0) {
        // No hay árbitros disponibles, designamos al azar y llamamos al callback
        callback(null);
        return;
    }

    candidatos.forEach(function(arb) {
        const card = document.createElement("button");
        card.className = "arbitro-candidato";

        let claseConf = "confiabilidad-media";
        if (arb.confiabilidad >= 75) claseConf = "confiabilidad-alta";
        else if (arb.confiabilidad < 60) claseConf = "confiabilidad-baja";

        card.innerHTML =
            "<span class='ac-nombre'>" + arb.nombre + "</span>" +
            "<div class='ac-nivel'>Nivel: <strong>" + arb.nivel + "</strong></div>" +
            "<div class='ac-estilo'>Estilo: " + arb.estilo + "</div>" +
            "<div class='ac-confiabilidad " + claseConf + "'>Confiabilidad: " + arb.confiabilidad + "</div>";

        card.addEventListener("click", function() {
            sonidoDecision();
            designarArbitroManual(ligaId, numeroFecha, indicePartido, arb.id);
            cerrarModalDesignacion();
            callback(arb);
        });

        contenedor.appendChild(card);
    });

    document.getElementById("modal-designacion").classList.remove("modal-oculto");
}

function cerrarModalDesignacion() {
    document.getElementById("modal-designacion").classList.add("modal-oculto");
}

// -----------------------------
// SECCIÓN DE FINANZAS
// -----------------------------

function renderizarFinanzas() {
    const resumen = document.getElementById("resumen-financiero");
    if (!resumen) return;

    const datos = obtenerResumenFinanciero();

    let htmlResumen = "<div class='resumen-fin'>";
    htmlResumen += "<div class='resumen-item'>";
    htmlResumen += "<span class='res-label'>Ingresos del año</span>";
    htmlResumen += "<span class='res-valor'>+$" + datos.ingresos + "M</span>";
    htmlResumen += "</div>";

    htmlResumen += "<div class='resumen-item'>";
    htmlResumen += "<span class='res-label'>Egresos del año</span>";
    htmlResumen += "<span class='res-valor'>-$" + datos.egresos + "M</span>";
    htmlResumen += "</div>";

    const claseBalance = datos.balance >= 0 ? "" : " negativo";
    htmlResumen += "<div class='resumen-item'>";
    htmlResumen += "<span class='res-label'>Balance parcial</span>";
    htmlResumen += "<span class='res-valor" + claseBalance + "'>" + (datos.balance >= 0 ? "+" : "") + "$" + datos.balance + "M</span>";
    htmlResumen += "</div>";

    htmlResumen += "</div>";
    resumen.innerHTML = htmlResumen;

    if (datos.sponsor) {
        const sp = datos.sponsor;
        const logoHTML = htmlLogoSponsor(sp.id, sp.nombre, 60);

        resumen.innerHTML +=
            "<div class='sponsor-actual'>" +
                logoHTML +
                "<div class='sponsor-info'>" +
                    "<div class='sp-nombre'>" + sp.nombre + "</div>" +
                    "<div class='sp-meta'>" + sp.rubro + " · Monto base: $" + sp.montoBase + "M · Bonus: $" + sp.bonusPrestigio + "M · " + sp.popularidad + "</div>" +
                "</div>" +
            "</div>";
    } else {
        resumen.innerHTML += "<p style='color:#8b9bb0'>Todavía no firmaste un sponsor para este año.</p>";
    }

    const clubesDiv = document.getElementById("clubes-deuda");
    if (clubesDiv) {
        const clubes = obtenerClubesConDeuda();

        if (clubes.length === 0) {
            clubesDiv.innerHTML = "<h3 style='color:#86efac;font-size:0.95em;text-transform:uppercase;letter-spacing:1px;margin:20px 0 10px 0'>Sin clubes en crisis</h3>";
        } else {
            let htmlDeuda = "<h3 style='color:#86efac;font-size:0.95em;text-transform:uppercase;letter-spacing:1px;margin:20px 0 10px 0'>Clubes con deuda</h3>";
            htmlDeuda += "<div class='clubes-deuda-lista'>";

            clubes.forEach(function(c) {
                const rescatesTexto = c.rescates > 0 ? "(Rescatado " + c.rescates + " vez/veces)" : "";
                const puedePagar = presidente.dineroEnCaja >= c.costoRescate;

                htmlDeuda += "<div class='club-deuda'>";
                htmlDeuda += "<span class='cd-nombre'>" + c.nombre + " <span class='cd-liga'>· " + c.liga + "</span></span>";
                htmlDeuda += "<span class='cd-nivel " + c.nivel + "'>" + c.nivel + "</span>";
                htmlDeuda += "<span class='cd-rescates'>" + rescatesTexto + "</span>";
                htmlDeuda += "<button class='btn-rescatar' data-id='" + c.id + "' " + (puedePagar ? "" : "disabled") + ">Rescatar (-$" + c.costoRescate + "M)</button>";
                htmlDeuda += "</div>";
            });

            htmlDeuda += "</div>";
            clubesDiv.innerHTML = htmlDeuda;

            clubesDiv.querySelectorAll(".btn-rescatar").forEach(function(boton) {
                boton.addEventListener("click", function() {
                    sonidoClick();
                    const id = parseInt(this.dataset.id);
                    const equipoNombre = EQUIPOS[id].nombre;
                    const cantidadPrev = estadoFinanzas.rescates[id] || 0;
                    const resultado = rescatarClub(id);

                    if (resultado.exito) {
                        alert("Club rescatado.\n\n" + resultado.mensajePolitico);
                        sonidoDecision();
                        noticiaDeRescate(equipoNombre, resultado.costo, cantidadPrev + 1);
                    } else {
                        alert("No se pudo rescatar: " + resultado.motivo);
                    }
                    renderizarFinanzas();
                    renderizarPanelPresidente();
                    renderizarNoticias();
                });
            });
        }
    }

    const historialDiv = document.getElementById("historial-financiero");
    if (historialDiv) {
        if (datos.historial.length === 0) {
            historialDiv.innerHTML = "";
        } else {
            let htmlHist = "<h3 style='color:#86efac;font-size:0.95em;text-transform:uppercase;letter-spacing:1px;margin:20px 0 10px 0'>Historial financiero</h3>";
            htmlHist += "<table class='tabla-historial'>";
            htmlHist += "<thead><tr><th>Año</th><th>Ingresos</th><th>Egresos</th><th>Balance</th></tr></thead><tbody>";

            datos.historial.forEach(function(h) {
                const claseBalance = h.balance >= 0 ? "balance-positivo" : "balance-negativo";
                htmlHist += "<tr>";
                htmlHist += "<td>" + h.anio + "</td>";
                htmlHist += "<td>+$" + h.ingresos + "M</td>";
                htmlHist += "<td>-$" + h.egresos + "M</td>";
                htmlHist += "<td class='" + claseBalance + "'>" + (h.balance >= 0 ? "+" : "") + "$" + h.balance + "M</td>";
                htmlHist += "</tr>";
            });

            htmlHist += "</tbody></table>";
            historialDiv.innerHTML = htmlHist;
        }
    }
}

// -----------------------------
// PANEL DE ENCUESTA
// -----------------------------

function renderizarEncuesta() {
    const contenedor = document.getElementById("panel-encuesta");
    if (!contenedor) return;

    const encuesta = obtenerUltimaEncuesta();

    if (!encuesta) {
        contenedor.style.display = "none";
        return;
    }

    contenedor.style.display = "block";

    let html = "<div class='encuesta-header'>";
    html += "<span class='encuesta-titulo'>📊 Encuesta de opinión</span>";
    html += "<span class='encuesta-fecha'>Año " + encuesta.anio + " · Fecha " + encuesta.fecha + "</span>";
    html += "</div>";

    html += "<div class='encuesta-barras'>";

    html += "<div class='encuesta-fila'>";
    html += "<span class='encuesta-label'>Aprueba</span>";
    html += "<div class='encuesta-barra-wrap'>";
    html += "<div class='encuesta-barra aprobacion' style='width:" + encuesta.aprobacion + "%'></div>";
    html += "</div>";
    html += "<span class='encuesta-porcentaje pos'>" + encuesta.aprobacion + "%</span>";
    html += "</div>";

    html += "<div class='encuesta-fila'>";
    html += "<span class='encuesta-label'>Desaprueba</span>";
    html += "<div class='encuesta-barra-wrap'>";
    html += "<div class='encuesta-barra desaprobacion' style='width:" + encuesta.desaprobacion + "%'></div>";
    html += "</div>";
    html += "<span class='encuesta-porcentaje neg'>" + encuesta.desaprobacion + "%</span>";
    html += "</div>";

    html += "</div>";

    html += "<div class='encuesta-motivos'>";
    html += "<ul>";
    encuesta.motivos.forEach(function(m) {
        html += "<li>" + m + "</li>";
    });
    html += "</ul>";
    html += "</div>";

    contenedor.innerHTML = html;
}

// -----------------------------
// MODAL DE EVENTO ALEATORIO
// -----------------------------

function mostrarModalEvento(evento) {
    document.getElementById("evento-titulo").textContent = evento.titulo;
    document.getElementById("evento-descripcion").textContent = evento.descripcion;

    const contenedor = document.getElementById("evento-opciones");
    contenedor.innerHTML = "";

    evento.opciones.forEach(function(opcion) {
        const boton = document.createElement("button");
        boton.className = "opcion-decision";
        boton.innerHTML =
            "<strong>" + opcion.texto + "</strong>" +
            "<span class='opcion-resumen'>" + opcion.resumen + "</span>";

        boton.addEventListener("click", function() {
            sonidoDecision();
            opcion.efecto();
            registrarEvento(evento, opcion.texto);
            cerrarModalEvento();
            renderizarPanelPresidente();
            renderizarFinanzas();
            renderizarNoticias();
        });

        contenedor.appendChild(boton);
    });

    document.getElementById("modal-evento").classList.remove("modal-oculto");
}

function cerrarModalEvento() {
    document.getElementById("modal-evento").classList.add("modal-oculto");
}

// -----------------------------
// MODAL DE EVENTO AUTOMÁTICO
// -----------------------------

function mostrarModalEventoAutomatico(evento) {
    const modal = document.getElementById("modal-evento");
    const titulo = document.getElementById("evento-titulo");
    const descripcion = document.getElementById("evento-descripcion");
    const opciones = document.getElementById("evento-opciones");

    modal.querySelector(".modal-caja").style.borderColor = "#4ade80";

    titulo.textContent = "✨ " + evento.titulo;
    titulo.style.color = "#4ade80";

    let textoHTML = "<p>" + evento.descripcion + "</p>";
    textoHTML += "<p style='color:#4ade80;font-weight:bold;margin-top:15px'>¡Buena noticia! El efecto se aplicó automáticamente.</p>";
    descripcion.innerHTML = textoHTML;

    opciones.innerHTML = "";

    const boton = document.createElement("button");
    boton.className = "opcion-decision";
    boton.style.borderColor = "#4ade80";
    boton.innerHTML = "<strong>¡Bien!</strong>";
    boton.addEventListener("click", function() {
        sonidoClick();
        cerrarModalEvento();
        modal.querySelector(".modal-caja").style.borderColor = "";
        titulo.style.color = "";
    });

    opciones.appendChild(boton);

    modal.classList.remove("modal-oculto");
    sonidoLogro();
}

// -----------------------------
// MODAL DE SPONSORS
// -----------------------------

function mostrarModalSponsors(ofertas) {
    const contenedor = document.getElementById("lista-sponsors");
    contenedor.innerHTML = "";

    ofertas.forEach(function(sponsor) {
        const card = document.createElement("button");
        card.className = "sponsor-card";

        card.innerHTML =
            htmlLogoSponsor(sponsor.id, sponsor.nombre, 80) +
            "<span class='sc-nombre'>" + sponsor.nombre + "</span>" +
            "<span class='sc-rubro'>" + sponsor.rubro + "</span>" +
            "<span class='sc-montos'>" +
                "Monto base: <strong>$" + sponsor.montoBase + "M</strong><br>" +
                "Bonus por prestigio: <strong>$" + sponsor.bonusPrestigio + "M</strong>" +
            "</span>" +
            "<span class='sc-popularidad " + sponsor.popularidad + "'>" + sponsor.popularidad + "</span>";

        card.addEventListener("click", function() {
            sonidoClick();
            firmarSponsor(sponsor);
            noticiaDeSponsor(sponsor);
            cerrarModalSponsors();
            renderizarPanelPresidente();
            renderizarFinanzas();
            renderizarNoticias();
        });

        contenedor.appendChild(card);
    });

    document.getElementById("modal-sponsors").classList.remove("modal-oculto");
}

function cerrarModalSponsors() {
    document.getElementById("modal-sponsors").classList.add("modal-oculto");
}

// -----------------------------
// MODAL DEL VAR
// -----------------------------

function mostrarModalVAR() {
    document.getElementById("modal-var").classList.remove("modal-oculto");
}

function cerrarModalVAR() {
    document.getElementById("modal-var").classList.add("modal-oculto");
}

// -----------------------------
// MODAL DE INCIDENCIA EN CLÁSICO
// -----------------------------

function mostrarModalIncidencia(incidencia, partido) {
    document.getElementById("incidencia-titulo").textContent = "⚖️ Escándalo en el clásico";
    document.getElementById("incidencia-descripcion").textContent =
        incidencia.descripcion + " (" + incidencia.arbitro + ")";

    const contenedor = document.getElementById("incidencia-opciones");
    contenedor.innerHTML = "";

    const opciones = [
        {
            texto: "Sancionar al árbitro",
            resumen: "+5 apoyo de los clubes perjudicados, -5 apoyo de los beneficiados",
            efecto: function() {
                ajustarApoyo(3);
                ajustarPrestigio(-2);
                // Buscamos el árbitro por nombre y lo sancionamos
                Object.keys(ARBITROS).forEach(function(ligaId) {
                    const arb = ARBITROS[ligaId].find(function(a) { return a.nombre === incidencia.arbitro; });
                    if (arb) sancionarArbitro(arb.id);
                });
            }
        },
        {
            texto: "Defender al árbitro públicamente",
            resumen: "+5 confianza del cuerpo arbitral, -5 apoyo de los perjudicados",
            efecto: function() {
                ajustarApoyo(-5);
                ajustarPrestigio(3);
            }
        },
        {
            texto: "No hacer declaraciones",
            resumen: "Sin efecto. El tema se olvida.",
            efecto: function() {}
        }
    ];

    opciones.forEach(function(op) {
        const boton = document.createElement("button");
        boton.className = "opcion-decision";
        boton.innerHTML =
            "<strong>" + op.texto + "</strong>" +
            "<span class='opcion-resumen'>" + op.resumen + "</span>";

        boton.addEventListener("click", function() {
            sonidoDecision();
            op.efecto();
            cerrarModalIncidencia();
            renderizarPanelPresidente();
            renderizarArbitros();
        });

        contenedor.appendChild(boton);
    });

    document.getElementById("modal-incidencia").classList.remove("modal-oculto");
}

function cerrarModalIncidencia() {
    document.getElementById("modal-incidencia").classList.add("modal-oculto");
}

// -----------------------------
// PANEL RANKING FIFA
// -----------------------------

function renderizarRankingFifa() {
    const contenedor = document.getElementById("panel-ranking-fifa");
    if (!contenedor) return;

    const puesto = obtenerRanking();

    let badgeClase = "bajo";
    let badgeTexto = "En crisis";
    if (puesto <= 3) { badgeClase = "top"; badgeTexto = "Potencia mundial"; }
    else if (puesto <= 7) { badgeClase = "ok"; badgeTexto = "Top mundial"; }
    else if (puesto <= 11) { badgeClase = "medio"; badgeTexto = "Zona media"; }

    let html = "<div class='ranking-info'>";
    html += "<div>";
    html += "<div class='ranking-label'>Ranking FIFA</div>";
    html += "<div class='ranking-puesto'>#" + puesto + "</div>";
    html += "</div>";
    html += "<div>";
    html += "<span class='ranking-badge " + badgeClase + "'>" + badgeTexto + "</span>";
    html += "<div class='ranking-detalle'>La Selección está en el puesto " + puesto + " del ranking mundial.</div>";
    html += "</div>";
    html += "</div>";

    const historial = obtenerHistorialRanking();
    if (historial.length > 0) {
        html += "<div class='ranking-historial'>";
        historial.forEach(function(h) {
            const cambio = h.cambio;
            let textoCambio = "";
            if (cambio < 0) {
                textoCambio = "<span class='subida'>↑ " + Math.abs(cambio) + " puesto(s)</span>";
            } else if (cambio > 0) {
                textoCambio = "<span class='bajada'>↓ " + cambio + " puesto(s)</span>";
            } else {
                textoCambio = "(sin cambios)";
            }
            html += "<div class='ranking-hist-item'>Año " + h.anio + " · " + h.motivo + " · " + textoCambio + "</div>";
        });
        html += "</div>";
    }

    contenedor.innerHTML = html;
}

// -----------------------------
// SECCIÓN DE SELECCIÓN
// -----------------------------

function renderizarSeleccion() {
    const infoDT = document.getElementById("info-dt-seleccion");
    if (!infoDT) return;

    if (presidente.seleccionador) {
        const candidato = CANDIDATOS_DT.find(function(c) {
            return c.nombre === presidente.seleccionador;
        });
        const idDT = candidato ? candidato.id : null;
        const sueldo = sueldoDTActual();

        const nombreConSueldo =
            "<span class='dt-info-nombre'>DT: " + presidente.seleccionador +
            " <span style='color:#8b9bb0;font-size:0.85em'>· Sueldo: -$" + sueldo + "M/año</span></span>";

        if (idDT) {
            infoDT.innerHTML = htmlFotoDT(idDT, presidente.seleccionador, 50) + nombreConSueldo;
        } else {
            infoDT.innerHTML = nombreConSueldo;
        }
    } else {
        infoDT.textContent = "Todavía no elegiste DT.";
    }

    const contenedor = document.getElementById("lista-amistosos");
    contenedor.innerHTML = "";

    if (historialAmistosos.length === 0) {
        contenedor.innerHTML = "<p>Aún no se jugaron amistosos.</p>";
        return;
    }

    historialAmistosos.forEach(function(a) {
        const claseResultado =
            a.golesArg > a.golesRival ? "" :
            a.golesArg < a.golesRival ? " derrota" : " empate";

        const signoPrestigio = a.efectoPrestigio >= 0 ? "+" : "";
        const signoDinero = a.efectoDinero >= 0 ? "+" : "";

        const clasePrestigio = a.efectoPrestigio >= 0 ? "efecto-positivo" : "efecto-negativo";
        const claseDinero = a.efectoDinero >= 0 ? "efecto-positivo" : "efecto-negativo";

        const div = document.createElement("div");
        div.className = "amistoso" + claseResultado;
        div.innerHTML =
            "<div class='amistoso-marcador'>" +
                htmlBandera("Argentina", 24) +
                "Argentina " + a.golesArg + " - " + a.golesRival + " " +
                htmlBandera(a.rival, 24) +
                a.rival +
            "</div>" +
            "<div class='amistoso-efectos'>" +
                "Prestigio: <span class='" + clasePrestigio + "'>" + signoPrestigio + a.efectoPrestigio + "</span> · " +
                "Dinero: <span class='" + claseDinero + "'>" + signoDinero + "$" + Math.abs(a.efectoDinero) + "M</span>" +
            "</div>";

        contenedor.appendChild(div);
    });
}

// -----------------------------
// SECCIÓN COPA AMÉRICA
// -----------------------------

function renderizarCopa() {
    const contenedor = document.getElementById("contenido-copa");
    if (!contenedor) return;

    if (!copaActual) {
        contenedor.innerHTML = "<p>La Copa América se juega al final del Año 1 y del Año 3.</p>";
        return;
    }

    const titulosPosicion = {
        campeon: "🥇 ¡Argentina Campeón de la Copa América!",
        subcampeon: "🥈 Argentina Subcampeón",
        semifinales: "Argentina llegó a semifinales",
        cuartos: "Argentina eliminada en cuartos",
        grupos: "Argentina eliminada en fase de grupos"
    };

    let html = "";

    html += "<div class='copa-resultado-final'>";
    html += "<h3>" + titulosPosicion[copaActual.posicionArgentina] + "</h3>";
    html += "<p>Copa América " + copaActual.anio + " · " + presidente.seleccionador + "</p>";
    html += "</div>";

    ["A", "B", "C"].forEach(function(letra) {
        html += "<div class='copa-fase'>";
        html += "<div class='titulo-grupo'>Grupo " + letra + "</div>";
        html += "<table class='tabla-grupo-copa'>";
        html += "<tr><th>#</th><th>Equipo</th><th>Pts</th><th>DG</th></tr>";

        copaActual.resultadosGrupos[letra].tabla.forEach(function(eq, i) {
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td class='celda-equipo'>" + htmlBandera(eq.nombre, 22) + "<span>" + eq.nombre + "</span></td>";
            html += "<td>" + eq.Pts + "</td>";
            html += "<td>" + eq.DG + "</td>";
            html += "</tr>";
        });

        html += "</table></div>";
    });

    html += "<div class='copa-fase'><h4>Cuartos de final</h4>";
    copaActual.cuartos.forEach(function(p) { html += formatearPartidoCopa(p); });
    html += "</div>";

    html += "<div class='copa-fase'><h4>Semifinales</h4>";
    copaActual.semis.forEach(function(p) { html += formatearPartidoCopa(p); });
    html += "</div>";

    html += "<div class='copa-fase'><h4>Final</h4>";
    html += formatearPartidoCopa(copaActual.final);
    html += "</div>";

    contenedor.innerHTML = html;
}

function formatearPartidoCopa(p) {
    let penalesHTML = "";
    if (p.penales) {
        penalesHTML = "<span class='penales'>(" + p.penales + " pen.)</span>";
    }
    return "<div class='partido-copa'>" +
        "<span class='marcador'>" +
            htmlBandera(p.equipoA, 22) +
            p.equipoA + " " + p.golesA + " - " + p.golesB + " " + p.equipoB +
            htmlBandera(p.equipoB, 22) +
            penalesHTML +
        "</span>" +
    "</div>";
}

// -----------------------------
// SECCIÓN CONTINENTALES
// -----------------------------

function renderizarContinentales() {
    const contenedor = document.getElementById("contenido-continentales");
    if (!contenedor) return;

    const resumen = obtenerCampañasUltimoAnio();

    if (!resumen) {
        contenedor.innerHTML = "<p>La Copa Libertadores y la Sudamericana se juegan al final de cada temporada. Los mejores 8 clubes argentinos de la tabla anual participan.</p>";
        return;
    }

    let html = "";

    html += "<div class='cont-resumen'>";
    html += "<p><strong>Temporada " + resumen.anio + "</strong></p>";
    html += "<p>Dinero ingresado a la AFA: <strong>+$" + resumen.dineroTotal + "M</strong></p>";
    html += "<p>Efecto en el prestigio: <strong>" + (resumen.prestigioTotal >= 0 ? "+" : "") + resumen.prestigioTotal + "</strong></p>";
    html += "</div>";

    html += "<div class='cont-torneo'>";
    html += "<h3>🏆 Copa Libertadores</h3>";
    resumen.libertadores.forEach(function(c) {
        html += "<div class='cont-club'>";
        html += "<span class='cont-nombre'>" + c.club + "</span>";
        html += "<span class='cont-etapa " + c.etapa + "'>" + nombreEtapa(c.etapa) + "</span>";
        if (c.rivalEliminatorio) {
            html += "<span class='cont-rival'>Eliminado por " + c.rivalEliminatorio + "</span>";
        }
        html += "</div>";
    });
    html += "</div>";

    html += "<div class='cont-torneo'>";
    html += "<h3>🏆 Copa Sudamericana</h3>";
    resumen.sudamericana.forEach(function(c) {
        html += "<div class='cont-club'>";
        html += "<span class='cont-nombre'>" + c.club + "</span>";
        html += "<span class='cont-etapa " + c.etapa + "'>" + nombreEtapa(c.etapa) + "</span>";
        if (c.rivalEliminatorio) {
            html += "<span class='cont-rival'>Eliminado por " + c.rivalEliminatorio + "</span>";
        }
        html += "</div>";
    });
    html += "</div>";

    contenedor.innerHTML = html;
}

function nombreEtapa(id) {
    const mapa = {
        grupos: "Fase de grupos",
        octavos: "Octavos",
        cuartos: "Cuartos",
        semis: "Semifinales",
        final: "Subcampeón",
        campeon: "🏆 Campeón"
    };
    return mapa[id] || id;
}

// -----------------------------
// SECCIÓN NOTICIAS
// -----------------------------

function renderizarNoticias() {
    const contenedor = document.getElementById("lista-noticias");
    if (!contenedor) return;

    if (typeof noticiasHistoricas === "undefined" || noticiasHistoricas.length === 0) {
        contenedor.innerHTML = "<p style='color:#8b9bb0'>Todavía no hay noticias. Jugá algunas fechas para ver titulares.</p>";
        return;
    }

    contenedor.innerHTML = "";

    const ultimas = noticiasHistoricas.slice(-10).reverse();

    ultimas.forEach(function(n) {
        const div = document.createElement("div");
        div.className = "noticia " + (n.tipo || "");
        div.innerHTML =
            "<span class='not-medio'>" + n.medio + "</span>" +
            "<div class='not-titulo'>" + n.titulo + "</div>" +
            "<div class='not-cuerpo'>" + n.cuerpo + "</div>" +
            "<div class='not-fecha'>" + n.fecha + "</div>";
        contenedor.appendChild(div);
    });
}

// -----------------------------
// MODAL DE DECISIONES
// -----------------------------

function mostrarDecision(decision) {
    document.getElementById("decision-titulo").textContent = decision.titulo;
    document.getElementById("decision-descripcion").textContent = decision.descripcion;

    const contenedor = document.getElementById("decision-opciones");
    contenedor.innerHTML = "";

    decision.opciones.forEach(function(opcion) {
        const boton = document.createElement("button");
        boton.className = "opcion-decision";
        boton.innerHTML =
            "<strong>" + opcion.texto + "</strong>" +
            "<span class='opcion-resumen'>" + opcion.resumen + "</span>";

        boton.addEventListener("click", function() {
            sonidoDecision();
            opcion.efecto();
            presidente.historialDecisiones.push({
                decision: decision.titulo,
                eleccion: opcion.texto
            });

            noticiaDeDecision(decision.titulo, opcion.texto);

            cerrarModalDecision();
            renderizarPanelPresidente();
            renderizarDecisionesRecientes();
            renderizarNoticias();
        });

        contenedor.appendChild(boton);
    });

    document.getElementById("modal-decision").classList.remove("modal-oculto");
}

function cerrarModalDecision() {
    document.getElementById("modal-decision").classList.add("modal-oculto");
}

// -----------------------------
// DECISIONES RECIENTES
// -----------------------------

function renderizarDecisionesRecientes() {
    const contenedor = document.getElementById("decisiones-recientes");
    if (!contenedor) return;

    if (presidente.historialDecisiones.length === 0) {
        contenedor.innerHTML = "<p style='color:#8b9bb0'>Todavía no tomaste ninguna decisión.</p>";
        return;
    }

    contenedor.innerHTML = "<h3 style='color:#4ade80;font-size:0.95em;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px'>Tus últimas decisiones</h3>";

    const ultimas = presidente.historialDecisiones.slice(-5).reverse();
    ultimas.forEach(function(d) {
        const div = document.createElement("div");
        div.className = "incidencia";
        div.style.borderLeftColor = "#4ade80";
        div.innerHTML =
            "<div class='inc-titulo' style='color:#4ade80'>" + d.decision + "</div>" +
            "<div class='inc-desc'>" + d.eleccion + "</div>";
        contenedor.appendChild(div);
    });
}

// -----------------------------
// INTRODUCCIÓN
// -----------------------------

function mostrarIntro() {
    document.getElementById("modal-intro").classList.remove("modal-oculto");
}

function cerrarIntro() {
    document.getElementById("modal-intro").classList.add("modal-oculto");
}

// -----------------------------
// ELECCIÓN DE DT
// -----------------------------

function mostrarEleccionDT() {
    const contenedor = document.getElementById("lista-candidatos");
    contenedor.innerHTML = "";

    CANDIDATOS_DT.forEach(function(candidato) {
        const boton = document.createElement("button");
        boton.className = "candidato";
        boton.innerHTML =
            htmlFotoDT(candidato.id, candidato.nombre, 70) +
            "<span class='cand-nombre'>" + candidato.nombre + "</span>" +
            "<span class='cand-perfil'>" + candidato.perfil + "</span>" +
            "<span class='cand-desc'>" + candidato.descripcion + "</span>" +
            "<span class='cand-resumen'>" + candidato.resumen + "</span>";

        boton.addEventListener("click", function() {
            sonidoLogro();
            elegirDT(candidato);
            noticiaDeEleccionDT(candidato);
            cerrarModalDT();
            renderizarPanelPresidente();
            renderizarSeleccion();
            renderizarRankingFifa();
            desbloquearJuego();

            setTimeout(function() {
                mostrarModalVAR();
            }, 300);
        });

        contenedor.appendChild(boton);
    });

    document.getElementById("modal-dt").classList.remove("modal-oculto");
}

function cerrarModalDT() {
    document.getElementById("modal-dt").classList.add("modal-oculto");
}

// -----------------------------
// MODAL DE FIN DE TEMPORADA
// -----------------------------

function renderizarFinDeTemporada(datos) {
    const titulo = document.getElementById("modal-fin-titulo");
    const cuerpo = document.getElementById("modal-fin-cuerpo");
    const boton = document.getElementById("btn-fin-accion");

    titulo.textContent = datos.titulo;

    let html = "<p>Terminó el Año " + presidente.anioMandato + " de tu gestión.</p>";

    html += "<h4 style='color:#4ade80;margin-top:15px'>Balance del año</h4>";
    html += "<div class='balance'>";
    html += "<div class='balance-item'><span>Apoyo de clubes</span><strong>" + formatoNumero(datos.balance.apoyo) + "</strong></div>";
    html += "<div class='balance-item'><span>Prestigio internacional</span><strong>" + formatoNumero(datos.balance.prestigio) + "</strong></div>";
    html += "<div class='balance-item'><span>Dinero</span><strong>" + formatoNumero(datos.balance.dinero) + "M</strong></div>";
    html += "<div class='balance-item'><span>Decisiones tomadas</span><strong>" + datos.balance.decisiones + "</strong></div>";
    html += "</div>";

    if (datos.movimientos) {
        html += "<h4 style='color:#4ade80;margin-top:20px'>Ascensos y descensos</h4>";
        html += "<div class='movimientos'>";

        if (datos.movimientos.ascendidos.length > 0) {
            html += "<div class='mov-grupo'>";
            html += "<span class='mov-titulo mov-ascenso'>⬆ Ascendidos</span>";
            datos.movimientos.ascendidos.forEach(function(m) {
                html += "<div class='mov-item'>" + m.nombre + " <small>(" + m.desde + " → " + m.hacia + ")</small></div>";
            });
            html += "</div>";
        }

        if (datos.movimientos.descendidos.length > 0) {
            html += "<div class='mov-grupo'>";
            html += "<span class='mov-titulo mov-descenso'>⬇ Descendidos</span>";
            datos.movimientos.descendidos.forEach(function(m) {
                html += "<div class='mov-item'>" + m.nombre + " <small>(" + m.desde + " → " + m.hacia + ")</small></div>";
            });
            html += "</div>";
        }

        if (datos.movimientos.nuevos.length > 0) {
            html += "<div class='mov-grupo'>";
            html += "<span class='mov-titulo mov-nuevo'>✨ Nuevos del Regional</span>";
            datos.movimientos.nuevos.forEach(function(m) {
                html += "<div class='mov-item'>" + m.nombre + " <small>(" + m.liga + ")</small></div>";
            });
            html += "</div>";
        }

        html += "</div>";
    }

    html += "<p style='margin-top:15px'>" + datos.mensajeFinal + "</p>";

    cuerpo.innerHTML = html;
    boton.textContent = datos.textoBoton;
    boton.disabled = false;

    const nuevoBoton = boton.cloneNode(true);
    boton.parentNode.replaceChild(nuevoBoton, boton);
    nuevoBoton.addEventListener("click", function() {
        sonidoClick();
        datos.accionBoton();
    });
}

function formatoNumero(n) {
    return (n >= 0 ? "+" : "") + n;
}
// -----------------------------
// MODAL DE CONFERENCIA DE PRENSA
// -----------------------------

function mostrarConferenciaPrensa(conferencia) {
    const personalidad = conferencia.personalidad;
    const preguntas = conferencia.preguntas;

    // Datos de la personalidad
    const datosPersonalidad = PERSONALIDADES[personalidad];

    // Título del modal
    document.getElementById("conferencia-titulo").innerHTML =
        "🎤 Conferencia de prensa";

    const cuerpo = document.getElementById("conferencia-cuerpo");
    cuerpo.innerHTML = "";

    // --- Encabezado con el periodista ---
    const periodistaDiv = document.createElement("div");
    periodistaDiv.className = "conf-periodista";
    periodistaDiv.style.borderLeftColor = datosPersonalidad.color;
    periodistaDiv.innerHTML =
        "<div class='conf-periodista-icono'>" + datosPersonalidad.icono + "</div>" +
        "<div class='conf-periodista-info'>" +
            "<div class='conf-periodista-nombre' style='color:" + datosPersonalidad.color + "'>" +
                datosPersonalidad.nombre +
            "</div>" +
            "<div class='conf-periodista-estilo'>" + datosPersonalidad.estilo + "</div>" +
        "</div>";
    cuerpo.appendChild(periodistaDiv);

    // --- Variables de estado ---
    let preguntasRespondidas = 0;

    // --- Renderizar cada pregunta ---
    preguntas.forEach(function(pregunta, indice) {
        const preguntaDiv = document.createElement("div");
        preguntaDiv.className = "conf-pregunta";

        let html = "<span class='conf-pregunta-numero'>Pregunta " + (indice + 1) + " de " + preguntas.length + "</span>";
        html += "<div class='conf-pregunta-texto'>" + pregunta.texto + "</div>";
        html += "<div class='conf-opciones'></div>";

        preguntaDiv.innerHTML = html;

        const opcionesDiv = preguntaDiv.querySelector(".conf-opciones");

        pregunta.opciones.forEach(function(opcion) {
            const boton = document.createElement("button");
            boton.className = "conf-opcion";
            boton.innerHTML =
                opcion.texto +
                "<span class='conf-opcion-resumen'>" + opcion.resumen + "</span>";

            boton.addEventListener("click", function() {
                if (boton.classList.contains("ya-elegida")) return;

                sonidoDecision();

                // Deshabilitamos todas las opciones de esta pregunta
                opcionesDiv.querySelectorAll(".conf-opcion").forEach(function(b) {
                    b.style.pointerEvents = "none";
                    b.style.opacity = "0.5";
                });

                // Marcamos la elegida
                boton.classList.add("ya-elegida");
                boton.style.opacity = "1";
                boton.style.pointerEvents = "auto";

                // Aplicamos el efecto
                opcion.efecto();

                preguntasRespondidas++;

                // Actualizamos el panel de fondo
                renderizarPanelPresidente();

                // Si ya respondió todo, cerramos automáticamente
                if (preguntasRespondidas >= preguntas.length) {
                    // Guardamos en noticias
                    registrarConferencia(personalidad, preguntasRespondidas);

                    // Noticia genérica
                    agregarNoticia(
                        datosPersonalidad.icono + " " + datosPersonalidad.nombre,
                        "El presidente respondió a la prensa",
                        "Conferencia de prensa en la AFA. El presidente respondió " + preguntasRespondidas + " preguntas del periodista " + datosPersonalidad.nombre + ".",
                        "rumor"
                    );

                    // Cerramos después de un pequeño delay
                    setTimeout(function() {
                        cerrarConferencia();
                        renderizarNoticias();
                        renderizarPanelPresidente();
                        renderizarFinanzas();
                    }, 400);
                }
            });

            opcionesDiv.appendChild(boton);
        });

        cuerpo.appendChild(preguntaDiv);
    });

    // Guardamos la conferencia activa
    window._conferenciaActiva = conferencia;

    // Mostramos el modal
    document.getElementById("modal-conferencia").classList.remove("modal-oculto");
    sonidoLogro();
}

function cerrarConferencia() {
    document.getElementById("modal-conferencia").classList.add("modal-oculto");
    window._conferenciaActiva = null;
}