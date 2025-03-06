const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let timerInterval;
let totalTime = 0;
let clients = [];

server.on('connection', socket => {
    clients.push(socket);

    socket.on('message', message => {
        const data = JSON.parse(message);
        if (data.type === 'start') {
            totalTime = data.time * 60;
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                if (totalTime < 0) {
                    const overTime = Math.abs(totalTime);
                    const timeString = `時間切れ ${overTime}秒`;
                    broadcast({ type: 'update', time: timeString });
                } else if (totalTime === 0) {
                    broadcast({ type: 'update', time: '時間切れ' });
                } else {
                    const minutes = Math.floor(totalTime / 60);
                    const seconds = totalTime % 60;
                    const timeString = totalTime >= 60 ? `残り時間: ${Math.ceil(totalTime / 60)}分` : `残り時間: ${seconds}秒`;
                    broadcast({ type: 'update', time: timeString });
                }
                totalTime--;
            }, 1000);
        } else if (data.type === 'stop') {
            clearInterval(timerInterval);
            broadcast({ type: 'update', time: 'タイマー停止' });
        }
    });

    socket.on('close', () => {
        clients = clients.filter(client => client !== socket);
    });
});

function broadcast(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}