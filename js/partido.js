// ============================================
// PARTIDO: cómo se simula UN partido
// ============================================
// La simulación base usa fuerzas + azar.
// Después el árbitro puede "incidir" en el resultado (con probabilidad media).

function simularPartido(equipoLocal, equipoVisitante) {
    // -----------------------------
    // 1) RESULTADO BASE POR FUERZAS
    // -----------------------------
    const dif = equipoLocal.fuerza - equipoVisitante.fuerza;

    // Goles esperados según la diferencia de fuerzas
    const espLocal = Math.max(0.3, 1.3 + dif / 25);
    const espVisitante = Math.max(0.3, 1.3 - dif / 25);

    const golesLocal = poisson(espLocal);
    const golesVisitante = poisson(espVisitante);

    const resultadoBase = {
        local: equipoLocal.nombre,
        visitante: equipoVisitante.nombre,
        golesLocal: golesLocal,
        golesVisitante: golesVisitante
    };

    // -----------------------------
    // 2) EFECTO DEL ÁRBITRO (si hay uno designado)
    // -----------------------------
    // Buscamos si este partido tiene árbitro. Como `simularPartido` no sabe
    // en qué fecha/índice está, el árbitro se le pasa desde afuera (liga.js).
    // Si no hay árbitro asignado, se devuelve el resultado base.

    return resultadoBase;
}

// Distribución de Poisson (para goles realistas)
function poisson(lambda) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}