const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const snmp = require('net-snmp');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const mikrotikIP = '192.168.88.10'; //ip address print
const session = snmp.createSession(mikrotikIP, 'public');

const oidRx = '1.3.6.1.2.1.2.2.1.10.1'; // Rx
const oidTx = '1.3.6.1.2.1.2.2.1.16.1'; // Tx

let lastRx = 0;
let lastTx = 0;

setInterval(() => {
  session.get([oidRx, oidTx], (error, varbinds) => {
    if (!error) {
      const rx = varbinds[0].value;
      const tx = varbinds[1].value;
      const rxRate = ((rx - lastRx) * 8) / 1e6; s
      const txRate = ((tx - lastTx) * 8) / 1e6;
      lastRx = rx;
      lastTx = tx;
      io.emit('bandwidth', {
        time: new Date().toLocaleTimeString(),
        rx: rxRate.toFixed(2),
        tx: txRate.toFixed(2),
        status: 'Conectado'
      });
    } else {
      io.emit('bandwidth', {
        time: new Date().toLocaleTimeString(),
        rx: 0,
        tx: 0,
        status: 'Erro na leitura'
      });
    }
  });
}, 1000);

server.listen(3001, () => console.log('Servidor SNMP rodando na porta 3001'));
