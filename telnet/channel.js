var events = require('events');
var net = require('net');
// 事件发射器会触发事件,并且在那些事件被触发时能处理他们
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
    // 让连接上来的用户看到当前有几个已连接的聊天用户
    const welcome = `Welcome!\nGuests online:${this.listeners('broadcast').length}`;
    client.write(welcome + '\n');
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId, message) {
        if (id !== senderId) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function(id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, `${id}has left the chat. \n`);
});

channel.on('shutdown', function() {
    channel.emit('broadcast', '', 'Chat has shut down.\n');
    channel.removeAllListeners('broadcast');
});

var server = net.createServer(function(client) {
    var id = `${client.remoteAddress}:${client.remotePort}`;
    channel.emit('join', id, client);

    client.on('data', function(data) {
        data = data.toString();
        if (data === 'shutdown\r\n') {
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data);
    });

    client.on('close', function() {
        channel.emit('leave', id);
    });
});
server.listen(8888);