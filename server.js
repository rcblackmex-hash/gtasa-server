const net = require('net');

const PORT = 7777;
const players = new Map();
let nextId = 1;

const server = net.createServer((socket) => {
    const id = nextId++;
    let playerName = 'Jugador' + id;
    
    console.log(`Jugador ${id} conectado`);
    players.set(id, { socket, name: playerName, x: 0, y: 0, z: 0 });

    const heartbeat = setInterval(() => {
        try { socket.write('PING\n'); } catch(e) {}
    }, 5000);

    socket.on('data', (data) => {
        const msg = data.toString().trim();
        const parts = msg.split('|');
        
        if (parts[0] === 'JOIN') {
            playerName = parts[1] || playerName;
            players.get(id).name = playerName;
            console.log(`${playerName} entro al servidor`);
            socket.write(`ID|${id}\n`);
            broadcast(`CHAT|${playerName} entro al juego\n`, id);
        }
        else if (parts[0] === 'POS') {
            const p = players.get(id);
            p.x = parseFloat(parts[1]) || 0;
            p.y = parseFloat(parts[2]) || 0;
            p.z = parseFloat(parts[3]) || 0;
            broadcastPos();
        }
        else if (parts[0] === 'CHAT') {
            broadcast(`CHAT|${playerName}: ${parts[1]}\n`, -1);
        }
    });

    socket.on('close', () => {
        clearInterval(heartbeat);
        console.log(`${playerName} salio`);
        players.delete(id);
        broadcast(`CHAT|${playerName} salio del juego\n`, -1);
    });

    socket.on('error', () => {
        clearInterval(heartbeat);
        players.delete(id);
    });
});

function broadcast(msg, excludeId) {
    players.forEach((p, pid) => {
        if (pid !== excludeId) {
            try { p.socket.write(msg); } catch(e) {}
        }
    });
}

function broadcastPos() {
    let msg = 'PLAYERS';
    players.forEach((p, pid) => {
        msg += `|${pid}|${p.name}|${p.x}|${p.y}|${p.z}`;
    });
    msg += '\n';
    players.forEach((p) => {
        try { p.socket.write(msg); } catch(e) {}
    });
}

server.listen(PORT, () => {
    console.log(`Servidor GTA SA corriendo en puerto ${PORT}`);
});
