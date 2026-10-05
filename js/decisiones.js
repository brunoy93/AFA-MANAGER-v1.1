// ============================================
// DECISIONES: todas las decisiones del presidente
// ============================================
// Cada decisión tiene: id, titulo, descripcion, categoria, opciones.
// Opcionalmente: desbloquea (id de otra decisión que se encola).
// Opcionalmente: condicion (función que devuelve true/false para que aparezca).

// Cola de decisiones encadenadas pendientes
const colaDecisiones = [];

// -----------------------------
// LISTA DE DECISIONES
// -----------------------------

const DECISIONES = [

    // ==================== DECISIONES BASE ====================

    {
        id: "sad",
        titulo: "Capital privado en los clubes",
        descripcion: "Un grupo empresario ofrece invertir 50 millones de dólares en un club grande. Los clubes del Interior amenazan con romper relaciones si lo permitís.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Permitir la inversión (SAD sí)",
                efecto: function() {
                    ajustarDinero(3000);
                    ajustarApoyo(-10);
                    ajustarPrestigio(5);
                    encolarDecision("regular_sad");
                },
                resumen: "+$3.000M, -10 apoyo, +5 prestigio · Desbloquea un debate futuro"
            },
            {
                texto: "Prohibir la inversión (SAD no)",
                efecto: function() {
                    ajustarApoyo(8);
                    ajustarPrestigio(-5);
                },
                resumen: "+8 apoyo, -5 prestigio"
            },
            {
                texto: "Crear una comisión para estudiarlo",
                efecto: function() {
                    ajustarApoyo(-4);
                    ajustarDinero(-300);
                },
                resumen: "-4 apoyo, -$300M (nadie queda contento)"
            }
        ]
    },

    {
        id: "fechasfifa",
        titulo: "Calendario y fechas FIFA",
        descripcion: "La liga sigue jugándose durante las fechas FIFA. Los clubes pierden a sus convocados en partidos clave y amenazan con no cederlos.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Pausar la liga en fechas FIFA",
                efecto: function() {
                    ajustarApoyo(10);
                    ajustarDinero(-500);
                },
                resumen: "+10 apoyo, -$500M (menos taquilla, más paz)"
            },
            {
                texto: "Seguir jugando igual",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarDinero(600);
                },
                resumen: "-8 apoyo, +$600M"
            }
        ]
    },

    {
        id: "tv",
        titulo: "Contrato de televisión",
        descripcion: "La TV ofrece renovar el contrato por 3 años, pero con una rebaja del 15%. Los clubes chicos dependen de ese dinero para sobrevivir.",
        categoria: "economica",
        opciones: [
            {
                texto: "Aceptar la rebaja",
                efecto: function() {
                    ajustarDinero(1500);
                    ajustarApoyo(-6);
                    encolarDecision("clubes_chicos_reclaman");
                },
                resumen: "+$1.500M, -6 apoyo · Desbloquea un reclamo futuro"
            },
            {
                texto: "Rechazar y negociar con otra empresa",
                efecto: function() {
                    if (Math.random() < 0.5) {
                        ajustarDinero(4500);
                        ajustarApoyo(4);
                    } else {
                        ajustarDinero(-800);
                        ajustarApoyo(-10);
                    }
                },
                resumen: "50%: +$4.500M +4 apoyo / 50%: -$800M -10 apoyo"
            }
        ]
    },

    {
        id: "ascenso",
        titulo: "Reparto del dinero del Ascenso",
        descripcion: "Los clubes del Interior del Ascenso denuncian que los de Buenos Aires reciben casi el doble de dinero por TV. Exigen igualdad.",
        categoria: "economica",
        opciones: [
            {
                texto: "Igualar el reparto",
                efecto: function() {
                    ajustarApoyo(12);
                    ajustarDinero(-900);
                },
                resumen: "+12 apoyo, -$900M"
            },
            {
                texto: "Mantener la diferencia",
                efecto: function() {
                    ajustarApoyo(-10);
                    ajustarDinero(400);
                },
                resumen: "-10 apoyo, +$400M"
            }
        ]
    },

    {
        id: "veron",
        titulo: "Sanción por incidentes en la Supercopa",
        descripcion: "El presidente de un club grande tuvo incidentes con la terna arbitral en la final. La prensa exige una sanción ejemplar.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Sancionarlo con dureza (1 año sin cancha)",
                efecto: function() {
                    ajustarApoyo(5);
                    ajustarPrestigio(6);
                    encolarDecision("reincidencia_club");
                },
                resumen: "+5 apoyo, +6 prestigio · Desbloquea un futuro incidente"
            },
            {
                texto: "Multa simbólica y a otra cosa",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(-5);
                    ajustarDinero(250);
                },
                resumen: "-6 apoyo, -5 prestigio, +$250M"
            }
        ]
    },

    // ==================== DEPORTIVAS ====================

    {
        id: "extranjeros",
        titulo: "Cupo de extranjeros",
        descripcion: "El cupo actual es de 5 extranjeros por equipo. Los clubes grandes piden aumentarlo a 7. Los chicos quieren bajarlo a 3.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Aumentar a 7",
                efecto: function() {
                    ajustarPrestigio(5);
                    ajustarApoyo(-6);
                    encolarDecision("revisar_cupo");
                },
                resumen: "+5 prestigio, -6 apoyo · Desbloquea debate futuro"
            },
            {
                texto: "Reducir a 3",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-4);
                },
                resumen: "+6 apoyo, -4 prestigio"
            },
            {
                texto: "Mantener 5",
                efecto: function() {
                    ajustarApoyo(-2);
                },
                resumen: "-2 apoyo (nadie conforme)"
            }
        ]
    },

    {
        id: "descensos",
        titulo: "¿Suspender los descensos?",
        descripcion: "Con la crisis económica, varios clubes piden suspender los descensos por un año. Los equipos chicos que pelean abajo se verían beneficiados.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Suspender los descensos",
                efecto: function() {
                    ajustarApoyo(10);
                    ajustarPrestigio(-8);
                },
                resumen: "+10 apoyo, -8 prestigio (todo el mundo critica)"
            },
            {
                texto: "Mantener los descensos",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarPrestigio(6);
                },
                resumen: "-8 apoyo, +6 prestigio (fair play)"
            }
        ]
    },

    {
        id: "sub20",
        titulo: "Inversión en la Selección Sub-20",
        descripcion: "La Sub-20 no clasificó al último Mundial juvenil. Los técnicos piden más presupuesto para inferiores.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Invertir fuerte ($800M)",
                efecto: function() {
                    ajustarDinero(-800);
                    ajustarPrestigio(6);
                },
                resumen: "-$800M, +6 prestigio"
            },
            {
                texto: "Inversión moderada ($300M)",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(2);
                },
                resumen: "-$300M, +2 prestigio"
            },
            {
                texto: "No invertir",
                efecto: function() {
                    ajustarPrestigio(-5);
                    ajustarApoyo(-3);
                },
                resumen: "-5 prestigio, -3 apoyo"
            }
        ]
    },

    {
        id: "femenino",
        titulo: "Profesionalizar el fútbol femenino",
        descripcion: "Las jugadoras piden contratos profesionales. Los clubes alegan que no tienen presupuesto.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Profesionalizar (AFA paga la mitad)",
                efecto: function() {
                    ajustarDinero(-1000);
                    ajustarPrestigio(8);
                    ajustarApoyo(-5);
                },
                resumen: "-$1.000M, +8 prestigio, -5 apoyo"
            },
            {
                texto: "Semi-profesional (solo viáticos)",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(3);
                },
                resumen: "-$300M, +3 prestigio"
            },
            {
                texto: "Dejar como está",
                efecto: function() {
                    ajustarPrestigio(-6);
                    ajustarApoyo(2);
                },
                resumen: "-6 prestigio, +2 apoyo (clubes contentos)"
            }
        ]
    },

    {
        id: "visitantes",
        titulo: "Regreso del público visitante",
        descripcion: "Hace años que no hay hinchas visitantes en las canchas. Algunos clubes piden que vuelvan. La policía advierte por incidentes.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Permitir en todos los partidos",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarDinero(400);
                    ajustarPrestigio(-5);
                },
                resumen: "+6 apoyo, +$400M, -5 prestigio"
            },
            {
                texto: "Permitir solo en clásicos",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarDinero(200);
                },
                resumen: "+2 apoyo, +$200M"
            },
            {
                texto: "Mantener la prohibición",
                efecto: function() {
                    ajustarApoyo(-4);
                    ajustarPrestigio(3);
                },
                resumen: "-4 apoyo, +3 prestigio"
            }
        ]
    },

    {
        id: "copa_nacional",
        titulo: "Crear una Copa Nacional",
        descripcion: "Se propone crear un torneo tipo Copa Argentina con todos los clubes del país. Suma fechas pero da prestigio.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Crear la Copa Nacional",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(5);
                    ajustarDinero(-400);
                },
                resumen: "+4 prestigio, +5 apoyo, -$400M"
            },
            {
                texto: "No crear",
                efecto: function() {
                    ajustarApoyo(-3);
                },
                resumen: "-3 apoyo"
            }
        ]
    },

    // ==================== ECONÓMICAS ====================

    {
        id: "tv_exterior",
        titulo: "Vender los derechos de TV al exterior",
        descripcion: "Una empresa internacional ofrece comprar los derechos del fútbol argentino para el exterior. Paga bien, pero quiere manejar los horarios.",
        categoria: "economica",
        opciones: [
            {
                texto: "Vender todo (cambio de horarios)",
                efecto: function() {
                    ajustarDinero(2000);
                    ajustarApoyo(-8);
                },
                resumen: "+$2.000M, -8 apoyo (los hinchas se quejan)"
            },
            {
                texto: "Vender solo los partidos de visitante",
                efecto: function() {
                    ajustarDinero(1000);
                    ajustarApoyo(-2);
                },
                resumen: "+$1.000M, -2 apoyo"
            },
            {
                texto: "No vender",
                efecto: function() {
                    ajustarApoyo(3);
                },
                resumen: "+3 apoyo (todo sigue igual)"
            }
        ]
    },

    {
        id: "sueldos_minimos",
        titulo: "Sueldos mínimos de jugadores",
        descripcion: "Los jugadores de la Primera Nacional y Federal A denuncian sueldos miserables. Piden un piso salarial.",
        categoria: "economica",
        opciones: [
            {
                texto: "Fijar piso salarial alto ($200K/mes)",
                efecto: function() {
                    ajustarApoyo(8);
                    ajustarDinero(-900);
                },
                resumen: "+8 apoyo, -$900M"
            },
            {
                texto: "Fijar piso salarial bajo ($80K/mes)",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarDinero(-300);
                    encolarDecision("huelga");
                },
                resumen: "+3 apoyo, -$300M · Desbloquea conflicto gremial"
            },
            {
                texto: "Dejar libre el mercado",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarDinero(200);
                },
                resumen: "-8 apoyo, +$200M"
            }
        ]
    },

    {
        id: "limite_salarial",
        titulo: "Límite salarial",
        descripcion: "Los clubes chicos piden un tope a los sueldos para que los grandes no se lleven a todos los buenos. Los grandes amenazan con resistir.",
        categoria: "economica",
        opciones: [
            {
                texto: "Implementar tope salarial general",
                efecto: function() {
                    ajustarApoyo(7);
                    ajustarPrestigio(-3);
                    ajustarDinero(-200);
                },
                resumen: "+7 apoyo, -3 prestigio, -$200M"
            },
            {
                texto: "Tope solo para Primera",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarDinero(-100);
                },
                resumen: "+2 apoyo, -$100M"
            },
            {
                texto: "No implementar tope",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarDinero(300);
                },
                resumen: "-5 apoyo, +$300M"
            }
        ]
    },

    {
        id: "sponsor_seleccion",
        titulo: "Sponsor de la camiseta de la Selección",
        descripcion: "Hay 3 marcas ofreciendo ser sponsor principal de la camiseta. Una es polémica pero paga más.",
        categoria: "economica",
        opciones: [
            {
                texto: "Aceptar la marca polémica (más plata)",
                efecto: function() {
                    ajustarDinero(1800);
                    ajustarApoyo(-8);
                    ajustarPrestigio(-3);
                },
                resumen: "+$1.800M, -8 apoyo, -3 prestigio"
            },
            {
                texto: "Aceptar la marca tradicional",
                efecto: function() {
                    ajustarDinero(900);
                    ajustarApoyo(4);
                },
                resumen: "+$900M, +4 apoyo"
            },
            {
                texto: "Dejar la camiseta sin sponsor",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarDinero(-100);
                },
                resumen: "+6 apoyo, -$100M"
            }
        ]
    },

    {
        id: "venta_jugadores",
        titulo: "Cupos para venta de jugadores al exterior",
        descripcion: "Los clubes venden cada vez más jóvenes a Europa. Algunos piden poner cupos para retener talento. Los clubes necesitan la plata.",
        categoria: "economica",
        opciones: [
            {
                texto: "Poner cupos estrictos (máx. 2 por club por año)",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(5);
                },
                resumen: "-6 apoyo, +5 prestigio (mejor futuro)"
            },
            {
                texto: "Sin cupos (libre mercado)",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarDinero(500);
                    ajustarPrestigio(-5);
                },
                resumen: "+6 apoyo, +$500M, -5 prestigio"
            }
        ]
    },

    // ==================== INSTITUCIONALES ====================

    {
        id: "intervencion",
        titulo: "Intervención a clubes en crisis",
        descripcion: "Hay 3 clubes con deudas enormes. La oposición pide que la AFA los intervenga. Los clubes rechazan la intervención.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Intervenir los 3 clubes",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(4);
                    ajustarDinero(-800);
                },
                resumen: "-6 apoyo, +4 prestigio, -$800M"
            },
            {
                texto: "Darles un préstamo blando",
                efecto: function() {
                    ajustarApoyo(4);
                    ajustarDinero(-1200);
                },
                resumen: "+4 apoyo, -$1.200M"
            },
            {
                texto: "Dejar que se arreglen",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarDinero(0);
                },
                resumen: "-3 apoyo (nadie conforme)"
            }
        ]
    },

    {
        id: "conmebol",
        titulo: "Relación con Conmebol",
        descripcion: "La Conmebol quiere que la AFA apoye su nueva propuesta de calendario continental. A cambio ofrece más cupos.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Apoyar a Conmebol",
                efecto: function() {
                    ajustarPrestigio(5);
                    ajustarApoyo(-4);
                    ajustarDinero(500);
                },
                resumen: "+5 prestigio, -4 apoyo, +$500M"
            },
            {
                texto: "Rechazar la propuesta",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-4);
                },
                resumen: "+6 apoyo, -4 prestigio"
            },
            {
                texto: "Abstenerse",
                efecto: function() {
                    ajustarApoyo(-1);
                    ajustarPrestigio(-1);
                },
                resumen: "-1 apoyo, -1 prestigio"
            }
        ]
    },

    {
        id: "corrupcion",
        titulo: "Denuncia de corrupción interna",
        descripcion: "Un exdirectivo denuncia un esquema de coimas en el manejo de los derechos de TV de los últimos años. La prensa está encima.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Investigar a fondo y publicar todo",
                efecto: function() {
                    ajustarDinero(-600);
                    ajustarPrestigio(8);
                    ajustarApoyo(-4);
                    encolarDecision("juicio_mediatico");
                },
                resumen: "-$600M, +8 prestigio, -4 apoyo · Desbloquea juicio mediático"
            },
            {
                texto: "Investigar en silencio",
                efecto: function() {
                    ajustarDinero(-200);
                    ajustarPrestigio(-3);
                },
                resumen: "-$200M, -3 prestigio"
            },
            {
                texto: "Desmentir todo públicamente",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarPrestigio(-8);
                    ajustarDinero(200);
                },
                resumen: "-8 apoyo, -8 prestigio, +$200M (tiempo comprado)"
            }
        ]
    },

    {
        id: "seguridad",
        titulo: "Estándares de seguridad en los estadios",
        descripcion: "Dos estadios no cumplen con las normas mínimas de seguridad. La AFA debe decidir si los clausura o les da plazo.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Clausurar hasta que se arreglen",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarPrestigio(6);
                },
                resumen: "-5 apoyo, +6 prestigio"
            },
            {
                texto: "Dar 6 meses de plazo",
                efecto: function() {
                    ajustarApoyo(-2);
                    ajustarPrestigio(2);
                },
                resumen: "-2 apoyo, +2 prestigio"
            },
            {
                texto: "Permitir con observaciones",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarPrestigio(-5);
                },
                resumen: "+3 apoyo, -5 prestigio (riesgo futuro)"
            }
        ]
    },

    {
        id: "torneo_verano",
        titulo: "Torneo de verano",
        descripcion: "Se propone un torneo de verano con clubes europeos. Da visibilidad y plata, pero carga el calendario.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Hacer torneo internacional",
                efecto: function() {
                    ajustarDinero(800);
                    ajustarPrestigio(3);
                    ajustarApoyo(-3);
                },
                resumen: "+$800M, +3 prestigio, -3 apoyo"
            },
            {
                texto: "Torneo solo con clubes argentinos",
                efecto: function() {
                    ajustarDinero(300);
                    ajustarApoyo(2);
                },
                resumen: "+$300M, +2 apoyo"
            },
            {
                texto: "No hacer torneo",
                efecto: function() {
                    ajustarApoyo(-1);
                },
                resumen: "-1 apoyo"
            }
        ]
    },

    // ==================== ENCADENADAS ====================

    {
        id: "regular_sad",
        titulo: "Regular las SAD",
        descripcion: "Tras haber aprobado la entrada de capital privado, tres clubes más quieren abrirse a las SAD. La oposición pide reglas claras.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Regular con reglas estrictas",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(-4);
                    ajustarDinero(300);
                },
                resumen: "+4 prestigio, -4 apoyo, +$300M"
            },
            {
                texto: "Permitir libremente",
                efecto: function() {
                    ajustarDinero(1500);
                    ajustarApoyo(-10);
                    ajustarPrestigio(-3);
                },
                resumen: "+$1.500M, -10 apoyo, -3 prestigio"
            },
            {
                texto: "Frenar la expansión de las SAD",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-2);
                },
                resumen: "+6 apoyo, -2 prestigio"
            }
        ]
    },

    {
        id: "clubes_chicos_reclaman",
        titulo: "Los clubes chicos reclaman por TV",
        descripcion: "Tras aceptar la rebaja de la TV, los clubes chicos quedaron al borde de la quiebra. Reclaman un auxilio inmediato.",
        categoria: "economica",
        opciones: [
            {
                texto: "Auxiliarlos con $800M",
                efecto: function() {
                    ajustarDinero(-800);
                    ajustarApoyo(8);
                },
                resumen: "-$800M, +8 apoyo"
            },
            {
                texto: "Auxiliarlos con $300M",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarApoyo(3);
                },
                resumen: "-$300M, +3 apoyo"
            },
            {
                texto: "Que se arreglen solos",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarPrestigio(-3);
                },
                resumen: "-8 apoyo, -3 prestigio"
            }
        ]
    },

    {
        id: "reincidencia_club",
        titulo: "Reincidencia del club violento",
        descripcion: "El club que sancionaste por los incidentes en la Supercopa volvió a tener problemas. Ahora es más grave.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Sancionarlo con descenso administrativo",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarPrestigio(8);
                    ajustarDinero(-200);
                },
                resumen: "-5 apoyo, +8 prestigio, -$200M"
            },
            {
                texto: "Quitarle 15 puntos",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(4);
                },
                resumen: "+2 apoyo, +4 prestigio"
            },
            {
                texto: "Multa y advertencia final",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarPrestigio(-4);
                },
                resumen: "-3 apoyo, -4 prestigio"
            }
        ]
    },

    {
        id: "huelga",
        titulo: "Huelga de futbolistas",
        descripcion: "Tras fijar sueldos mínimos muy bajos, los futbolistas del Ascenso decretaron una huelga. No se juega la próxima fecha.",
        categoria: "economica",
        opciones: [
            {
                texto: "Ceder y subir el piso salarial",
                efecto: function() {
                    ajustarDinero(-700);
                    ajustarApoyo(8);
                },
                resumen: "-$700M, +8 apoyo"
            },
            {
                texto: "Negociar un aumento gradual",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarApoyo(3);
                },
                resumen: "-$300M, +3 apoyo"
            },
            {
                texto: "Aplicar el reglamento: no juegan, pierden puntos",
                efecto: function() {
                    ajustarApoyo(-7);
                    ajustarPrestigio(3);
                },
                resumen: "-7 apoyo, +3 prestigio"
            }
        ]
    },

    {
        id: "revisar_cupo",
        titulo: "Los clubes piden revisar el cupo de extranjeros",
        descripcion: "Tras aumentar el cupo a 7, varios clubes chicos se quejan de que ya no pueden competir. Piden volver atrás.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Volver al cupo de 5",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-2);
                },
                resumen: "+6 apoyo, -2 prestigio"
            },
            {
                texto: "Mantener 7",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarPrestigio(3);
                },
                resumen: "-3 apoyo, +3 prestigio"
            },
            {
                texto: "Cupo mixto (5 en cancha, 7 en plantel)",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(1);
                },
                resumen: "+2 apoyo, +1 prestigio (solución salomónica)"
            }
        ]
    },

    {
        id: "juicio_mediatico",
        titulo: "Juicio mediático por la corrupción",
        descripcion: "Tras haber investigado la corrupción interna, la prensa descubrió que algunos directivos actuales están implicados. La opinión pública explota.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Echar a los implicados",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(6);
                    ajustarDinero(-400);
                },
                resumen: "+6 apoyo, +6 prestigio, -$400M"
            },
            {
                texto: "Suspenderlos hasta que se aclare",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(3);
                },
                resumen: "+2 apoyo, +3 prestigio"
            },
            {
                texto: "Defenderlos públicamente",
                efecto: function() {
                    ajustarApoyo(-10);
                    ajustarPrestigio(-8);
                },
                resumen: "-10 apoyo, -8 prestigio"
            }
        ]
    }
];

// -----------------------------
// SISTEMA DE DECISIONES
// -----------------------------

// Encola una decisión para que aparezca más adelante
function encolarDecision(idDecision) {
    colaDecisiones.push(idDecision);
}

// Devuelve una decisión disponible para mostrar
// Prioridad: 1) cola de encadenadas, 2) decisiones nuevas al azar
function obtenerDecisionDisponible(idsUsados) {
    // 1) Primero, ver si hay alguna encadenada en la cola
    while (colaDecisiones.length > 0) {
        const id = colaDecisiones.shift();
        if (!idsUsados.includes(id)) {
            const dec = DECISIONES.find(function(d) { return d.id === id; });
            if (dec) return dec;
        }
    }

    // 2) Si no hay encadenadas, tomar una nueva al azar
    const disponibles = DECISIONES.filter(function(d) {
        return !idsUsados.includes(d.id);
    });
    if (disponibles.length === 0) return null;
    return disponibles[Math.floor(Math.random() * disponibles.length)];
}