// ============================================
// SELECCIÓN: partidos amistosos
// ============================================

const FUERZA_DT = {
    "Pablo Aimar": 82,
    "Walter Samuel": 80,
    "Diego Simeone": 86,
    "Marcelo Gallardo": 84,
    "Javier Mascherano": 78,
    "Antonio Mohamed": 80
};

const RIVALES = [
    { nombre: "Brasil", fuerza: 88 },
    { nombre: "Francia", fuerza: 87 },
    { nombre: "España", fuerza: 86 },
    { nombre: "Inglaterra", fuerza: 85 },
    { nombre: "Alemania", fuerza: 83 },
    { nombre: "Portugal", fuerza: 84 },
    { nombre: "Países Bajos", fuerza: 83 },
    { nombre: "Bélgica", fuerza: 80 },
    { nombre: "Croacia", fuerza: 80 },
    { nombre: "Italia", fuerza: 82 },
    { nombre: "Uruguay", fuerza: 81 },
    { nombre: "Colombia", fuerza: 79 },
    { nombre: "México", fuerza: 75 },
    { nombre: "Estados Unidos", fuerza: 74 },
    { nombre: "Chile", fuerza: 72 },
    { nombre: "Perú", fuerza: 70 },
    { nombre: "Paraguay", fuerza: 71 },
    { nombre: "Ecuador", fuerza: 74 },
    { nombre: "Venezuela", fuerza: 68 },
    { nombre: "Bolivia", fuerza: 60 },
    { nombre: "Japón", fuerza: 76 },
    { nombre: "Corea del Sur", fuerza: 73 },
    { nombre: "Marruecos", fuerza: 77 },
    { nombre: "Senegal", fuerza: 76 },
    { nombre: "Australia", fuerza: 68 }
];

const historialAmistosos = [];

function fuerzaSeleccion() {
    const dt = presidente.seleccionador || "Antonio Mohamed";
    return FUERZA_DT[dt] || 80;
}

function simularAmistoso() {
    const rival = RIVALES[Math.floor(Math.random() * RIVALES.length)];
    const fuerzaArg = fuerzaSeleccion();
    const fuerzaRival = rival.fuerza;

    const dif = fuerzaArg - fuerzaRival;

    const espArg = Math.max(0.3, 1.2 + dif / 20);
    const espRival = Math.max(0.3, 1.2 - dif / 20);

    const golesArg = poisson(espArg);
    const golesRival = poisson(espRival);

    let efectoPrestigio = 0;
    let efectoDinero = 0;

    if (golesArg > golesRival) {
        efectoPrestigio = 3;
        efectoDinero = 250;
    } else if (golesArg === golesRival) {
        efectoPrestigio = 0;
        efectoDinero = 100;
    } else {
        efectoPrestigio = -3;
        efectoDinero = -50;
    }

    const resultado = {
        rival: rival.nombre,
        golesArg: golesArg,
        golesRival: golesRival,
        efectoPrestigio: efectoPrestigio,
        efectoDinero: efectoDinero
    };

    ajustarPrestigio(efectoPrestigio);
    ajustarDinero(efectoDinero);

    actualizarRankingPorAmistoso(resultado, rival.fuerza);

    historialAmistosos.push(resultado);
    return resultado;
}

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