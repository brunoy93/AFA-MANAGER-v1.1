// ============================================
// IMÁGENES: helpers centralizados para todo lo visual
// ============================================

const PALETA_PLACEHOLDER = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
    "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#06b6d4"
];

function colorPorNombre(nombre) {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
        hash = ((hash << 5) - hash) + nombre.charCodeAt(i);
        hash = hash & hash;
    }
    return PALETA_PLACEHOLDER[Math.abs(hash) % PALETA_PLACEHOLDER.length];
}

function htmlEscudo(idEquipo, nombreEquipo, tamaño) {
    const tam = tamaño || 32;
    const inicial = nombreEquipo.charAt(0).toUpperCase();
    const color = colorPorNombre(nombreEquipo);

    return (
        "<span class='img-wrap' style='width:" + tam + "px;height:" + tam + "px;background:" + color + "'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='img/escudos/" + idEquipo + ".png' alt='" + nombreEquipo + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + tam + "px;object-fit:contain;'>" +
        "</span>"
    );
}

function htmlBandera(nombrePais, tamaño) {
    const tam = tamaño || 32;
    const inicial = nombrePais.charAt(0).toUpperCase();
    const color = colorPorNombre(nombrePais);
    const archivo = normalizarNombre(nombrePais);

    return (
        "<span class='img-wrap' style='width:" + tam + "px;height:" + Math.round(tam * 0.67) + "px;background:" + color + "'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='img/banderas/" + archivo + ".png' alt='" + nombrePais + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + Math.round(tam * 0.67) + "px;object-fit:cover;'>" +
        "</span>"
    );
}

function htmlFotoDT(idDT, nombreDT, tamaño) {
    const tam = tamaño || 60;
    const inicial = nombreDT.charAt(0).toUpperCase();
    const color = colorPorNombre(nombreDT);

    return (
        "<span class='img-wrap img-wrap-redondo' style='width:" + tam + "px;height:" + tam + "px;background:" + color + "'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='img/dts/" + idDT + ".png' alt='" + nombreDT + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + tam + "px;object-fit:cover;'>" +
        "</span>"
    );
}

function htmlLogoSponsor(idSponsor, nombreSponsor, tamaño) {
    const tam = tamaño || 60;
    const inicial = nombreSponsor.charAt(0).toUpperCase();
    const color = colorPorNombre(nombreSponsor);

    return (
        "<span class='img-wrap' style='width:" + tam + "px;height:" + tam + "px;background:" + color + "'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='img/sponsors/" + idSponsor + ".png' alt='" + nombreSponsor + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + tam + "px;object-fit:contain;'>" +
        "</span>"
    );
}

function normalizarNombre(nombre) {
    return nombre
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[áàäâ]/g, "a")
        .replace(/[èéëê]/g, "e")
        .replace(/[íìïî]/g, "i")
        .replace(/[óòöô]/g, "o")
        .replace(/[úùüû]/g, "u")
        .replace(/ñ/g, "n");
}