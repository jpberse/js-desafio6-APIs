const inputCLP = document.querySelector('#input-CLP');
const selectMoneda = document.querySelector('#select-moneda');
const resultado = document.querySelector('#resultado');
const btnConvertir = document.querySelector('#btn-convertir');
const titulo = document.querySelector('.titulo')
const cambioMoneda = selectMoneda.value;


async function getMonedas() {
    try {
        const res = await fetch('https://mindicador.cl/api/');
        const monedas = await res.json();
        return monedas
    } catch(e) {
        const cardConvertirMoneda = document.querySelector('.card-conversor');
        cardConvertirMoneda.remove();
        titulo.textContent = `A ocurrido un error: ${e.message}`;
    }
}

async function getChart(tipo) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${tipo}`);
        const tipoMoneda = res.json();
        return tipoMoneda
    } catch(e) {
        console.log(e.message)
    }
}

getMonedas();

btnConvertir.addEventListener('click', async () => {
    const monedas = await getMonedas();
    const cambio = selectMoneda.value;
    const valorCambio = monedas[cambio].valor;
    const pesoCLP = inputCLP.value;

    if(isNaN(pesoCLP) || pesoCLP <= 0) {
        resultado.textContent = 'Por favor, ingresa un monto valido';
        return
    }

    const result = parseFloat(pesoCLP / valorCambio).toFixed(2);

    if(cambio === 'dolar') {
        resultado.innerHTML = `$ ${result}`;
    } else if (cambio === 'euro') {
        resultado.innerHTML = `€ ${result}`;
    } else if(cambio === 'bitcoin') {
        resultado.innerHTML = `₿ ${result}`;
    }
})