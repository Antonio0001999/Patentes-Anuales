window.onload = main;

let anuales = [];
let locales = [];
let rangos = [];

let txbPrecio, resultado, errorResultado, cbFormato;
let PORCENTAJE = 0.05;

async function main() {
    locales = JSON.parse(localStorage.getItem("Personalizadas"));

    anuales = await fetch("./Recursos/Anuales.json")
    .then(res => res.json());

    let selectTabla = document.querySelector("#rangosAnuales");
    for (let i = 0; i < locales.length; i++) {
        const tabla = locales[i];
        selectTabla.innerHTML = `<option value="${tabla.nombre}">${tabla.nombre}</option>`
    }
    for (let i = anuales.length - 1; i >= 0; i--) {
        const anual = anuales[i];
        selectTabla.innerHTML += `<option value="${anual.nombre}">${anual.nombre}</option>`;
    }
    selectTabla.addEventListener("change", (e) => { establecerRango(e.target.value) });

    let txbPrecio =  document.querySelector("#txbPrecio")
    txbPrecio.addEventListener("input", calcular);
    txbPrecio.addEventListener("propertychange", calcular);

    resultado = document.querySelector("#resultado");

    cbFormato = document.querySelector("#cbFormato");
    if (localStorage.getItem("Formato") == "true") { cbFormato.checked = true; }
    else { cbFormato.checked = false; }
    cbFormato.onchange = (e) => {
        let formato = e.target.checked;
        localStorage.setItem("Formato", formato);
        calcular();
    }
    
    establecerRango(selectTabla.value);
}

function calcular() {
    let precio = document.querySelector("#txbPrecio").value;
    if (cbFormato.checked) { precio = precio.replace(".","").replace(",","."); }

    if(precio > 0) {
        const rango = obtenerRango(precio);
        resultado.value = "";

        let total = ((((precio - precio*PORCENTAJE) - rango.base) * rango.alicuota / 100) + rango.cuotaFija) / rango.cuotas;

        resultado.value = Math.round(total*100)/100;
    }
    else { resultado.value = precio === "0" ? "0": ""; }
}

function obtenerRango(precio) {
    let rng = null;

    for (let i = 0; i < rangos.length; i++) {
        const rango = rangos[i];
        
        if (precio > rango.base) { rng = rango; }
    }

    return rng;
}

function establecerRango(nombre) {
    rangos = null;

    for (let i = 0; i < anuales.length; i++) {
        const anual = anuales[i];

        if (anual.nombre == nombre) { rangos = anual.rangos; }
    }

    if (rangos == null) {
        let locales = JSON.parse(localStorage.getItem("Personalizadas"));
        for (let i = 0; i < locales.length; i++) {
            const tabla = locales[i];
            if (tabla.nombre == nombre) { rangos = tabla.rangos; }
        }
    }
    
    calcular();
}