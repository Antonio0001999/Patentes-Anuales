window.onload = main;

async function main() {
    let locales = JSON.parse(localStorage.getItem("Personalizadas"));
    locales = locales == null ? [] : locales;

    let anuales = await fetch("./Recursos/Anuales.json")
        .then(res => res.json());

    let divTablas = document.querySelector("#divTablas");

    for (let i = locales.length; i >= 0; i--) {
        const tabla = locales[i];
        if (tabla != null) {
            divTablas.innerHTML += generarTabla(tabla, true);
        }
    }

    for (let i = anuales.length - 1; i >= 0; i--) {
        const anual = anuales[i];
        if (anual != null) {
            divTablas.innerHTML += generarTabla(anual);
        }
    }

    let btnAgregar = document.querySelector("#btnAgregar");
    btnAgregar.addEventListener("click", agregarTabla);
}

function generarTabla(datos, local) {
    let textoBorrar = "";
    if (local === true) {
        textoBorrar = `<label class="pulsable" onclick="eliminarTabla('${datos.nombre}');">✕</label>`;
    }

    let titulo = `<h1 class="mt-5">${datos.nombre} ${textoBorrar}</h1>`;
    let parrafo = `<p class="mt-2">Nº de cuotas: <label class="h5 text-info">${datos.rangos[0].cuotas}</label></p>`
    let tabla = `
        <table class="mt-2 table table-hover">
            <tr>
                <th>Base Imponible</th><th>Base Imponible (topes)</th><th>Cuota Fija ($)</th><th>Alícuota / Excedente límite mínimo</th>
            </tr>
    `;

    for (let i = 0; i < datos.rangos.length; i++) {
        const rango = datos.rangos[i];
        let tope = rango.base == 0.00 ? 0.00 : rango.base - 0.01;
        tabla += `<tr><td>${rango.base.toLocaleString()}</td><td>${tope.toLocaleString()}</td><td>${rango.cuotaFija.toLocaleString()}</td><td>${rango.alicuota.toLocaleString()}</td></tr>`
    }

    tabla += `</table>`;

    return titulo + parrafo + tabla;
}

function agregarTabla() {
    let errores = document.querySelector("#errorValores");
    errores.innerHTML = "";

    try {
        let nombre = document.querySelector("#nombre").value;
        if (nombre == "") { return errores.innerHTML = "Se requiere nombre para la tabla."; }

        let bases = (document.querySelector("#bases").value).split(";");
        let alicuotas = (document.querySelector("#alicuotas").value).split(";");
        let cuotasFijas = (document.querySelector("#cuotasFijas").value).split(";");
        let cuotas = (document.querySelector("#cuotas").value);

        let tabla = {
            nombre: nombre,
            rangos: []
        }

        if (bases.length != cuotasFijas.length && bases.length != alicuotas.length) {
            return errores.innerHTML = "Las cantidades de datos introducidas no coinciden.";
        }

        for (let i = 0; i < bases.length; i++) {
            const base = bases[i], cuotaFija = cuotasFijas[i], alicuota = alicuotas[i];
            tabla.rangos.push({ base: base, cuotaFija: cuotaFija, alicuota: alicuota, cuotas: cuotas })
        }

        let locales = JSON.parse(localStorage.getItem("Personalizadas"));
        if (!locales) { locales = [] }

        locales.push(tabla);
        localStorage.setItem("Personalizadas", JSON.stringify(locales));
        window.location.reload();
    }
    catch (error) { errores.innerHTML = "Algo falló al intentar crear la tabla."; }
}

function eliminarTabla(nombre) {
    let locales = JSON.parse(localStorage.getItem("Personalizadas"));
    if (!locales) { locales = [] }

    locales = locales.filter(tabla => tabla.nombre != nombre);
    localStorage.setItem("Personalizadas", JSON.stringify(locales));

    window.location.reload();
}