const inputCLP = document.querySelector('#input-CLP');
const selectMoneda = document.querySelector('#select-moneda');
const resultado = document.querySelector('#resultado');
const btnConvertir = document.querySelector('#btn-convertir');
const titulo = document.querySelector('.titulo')
let chartInstance = null 


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
        const tipoMoneda = await res.json();
        return tipoMoneda
    } catch(e) {
        console.log(e.message)
    }
}

const configChart = (monedas) => {
    const fechaMoneda = monedas.serie.map((moneda) => moneda.fecha.slice(0,10));
    fechaMoneda.splice(10);
    fechaMoneda.reverse();
    const titulo = monedas.codigo;
    let colorLinea = '' ;
    const valores = monedas.serie.map((moneda) => {
        const valor = moneda.valor
        return Number(valor);
    })
    
    if(monedas.codigo == 'euro') {
        colorLinea = 'blue'
    } else if(monedas.codigo == 'bitcoin') {
        colorLinea = 'orange'
    } else {
        colorLinea = 'red'
    }

    const config = {
        type: 'line',
        data: {
            labels: fechaMoneda,
            datasets: [{
                label: titulo,
                backgroundColor: colorLinea,
                data: valores
            }]
        }
    };
    return config
}

async function renderChart(moneda) {
    const monedas = await getChart(moneda);
    const config = configChart(monedas);
    const chartDom = document.querySelector('#chart-monedas');
    chartDom.style.backgroundColor = 'white';
    chartDom.style.borderRadius = '10px';

    if(chartInstance){
        chartInstance.destroy()
    }
    
    chartInstance = new Chart(chartDom, config);
    chartInstance.resize(600, 600);
}

getMonedas();

btnConvertir.addEventListener('click', async () => {
    const monedas = await getMonedas();
    const cambio = selectMoneda.value;
    const valorCambio = monedas[cambio].valor;
    const pesoCLP = inputCLP.value;

    console.log(valorCambio)

    if(isNaN(pesoCLP) || pesoCLP <= 0) {
        resultado.textContent = 'Por favor, ingresa un monto valido';
        return
    }

    const result = parseFloat(pesoCLP / valorCambio).toFixed(2);

    if(cambio === 'dolar') {
        resultado.innerHTML = `$${result}`;
        renderChart('dolar')
    } else if (cambio === 'euro') {
        resultado.innerHTML = `€${result}`;
        renderChart('euro')
    } else if(cambio === 'bitcoin') {
        resultado.innerHTML = `₿${result}`;
        renderChart('bitcoin')
    }
})