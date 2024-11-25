const socket = io();
const tempData = [];
const humData = [];
const soilHumData = [];

const timeLabels = []; // Usamos las mismas etiquetas de tiempo para todas las gráficas

// Crear gráficos con Chart.js
const tempChart = new Chart(document.getElementById('tempChart'), {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Temperatura (°C)',
            data: tempData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Esto permitirá ajustar el tamaño del canvas
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const humChart = new Chart(document.getElementById('humChart'), {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Humedad (%)',
            data: humData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const soilHumChart = new Chart(document.getElementById('soilHumChart'), {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Humedad Suelo (%)',
            data: soilHumData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Recibir nuevos datos vía socket.io y actualizar los gráficos
socket.on('nuevoMensaje', (mensaje) => {
    const { topico, valor } = mensaje;
    const now = new Date().toLocaleTimeString();
    timeLabels.push(now);

    if (timeLabels.length > 10) { // Limitar a 10 datos
        timeLabels.shift();
    }

    if (topico === 'sensores/temperatura') {
        document.getElementById('temperatura').innerText = valor;
        tempData.push(valor);
        if (tempData.length > 10) tempData.shift();
        tempChart.update();
    } else if (topico === 'sensores/humedad') {
        document.getElementById('humedad').innerText = valor;
        humData.push(valor);
        if (humData.length > 10) humData.shift();
        humChart.update();
    } else if (topico === 'sensores/humedad_suelo') {
        document.getElementById('humedadSuelo').innerText = valor;
        soilHumData.push(valor);
        if (soilHumData.length > 10) soilHumData.shift();
        soilHumChart.update();
    }

});


// Botones para publicar en el tópico actuadores
document.getElementById('btnOn').addEventListener('click', () => {
    socket.emit('publicar', 'ON');
});

document.getElementById('btnOff').addEventListener('click', () => {
    socket.emit('publicar', 'OFF');
});

document.getElementById('btnManual').addEventListener('click', () => {
    socket.emit('publicar', 'MANUAL');
});
document.getElementById('btnAuto').addEventListener('click', () => {
    socket.emit('publicar', 'AUTO');
});