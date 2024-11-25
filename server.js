const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql');
const path = require('path');


// Configuración MQTT
const mqttClient = mqtt.connect('tls://742913451e8242788e9c1f883f34cc77.s1.eu.hivemq.cloud:8883', {
    username: 'Usuario1',
    password: 'Usuario1'
});

const app = express();
const port = 3000;

// Configuración MySQL
const db = require('./db_config');

// Servir archivos estáticos
app.use(express.static('public'));

// Conexión MQTT
mqttClient.on('connect', () => {
    console.log('Conectado a HiveMQ');
    mqttClient.subscribe('sensores/temperatura');
    mqttClient.subscribe('sensores/humedad');
    mqttClient.subscribe('sensores/humedad_suelo');
});

mqttClient.on('message', (topic, message) => {
    const valor = parseFloat(message.toString());
    console.log(`Mensaje recibido en ${topic}: ${valor}`);

    // Guardar en la base de datos
    const query = 'INSERT INTO datos_sensores (topico, valor) VALUES (?, ?)';
    db.query(query, [topic, valor], (err, result) => {
        if (err) throw err;
        console.log('Dato guardado en la base de datos');
    });

    // Emitir mensaje a los clientes conectados
    io.emit('nuevoMensaje', { topico: topic, valor });
});

// Inicializar servidor de Socket.io para comunicación en tiempo real
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Ruta para servir la página web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', socket => {
    console.log('Cliente conectado');
    
    // Publicar en el tópico actuadores cuando se presiona un botón
    socket.on('publicar', mensaje => {
        mqttClient.publish('sensores/actuadores', mensaje, (err) => {
            if (err) {
                console.error('Error publicando mensaje en MQTT:', err);
            } else {
                console.log(`Mensaje publicado en actuadores: ${mensaje}`);
            }
        });
    });
});


// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
