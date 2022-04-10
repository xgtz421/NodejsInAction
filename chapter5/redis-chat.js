const net = require('net');
const redis = require('redis');

const server = net.createServer(function(socket) {
    let subscriber;
    let publisher;
    socket.on('connect', async function() {
        subscriber = redis.duplicate();
        await subscriber.connect();
        await subscriber.subscribe('main_chat_room', (message) => {
            socket.write('Channel'+channel+':'+message);
        });
        // subscriber.on('message', function(channel, message) {
        //     socket.write('Channel'+channel+':'+message);
        // });

        publisher = redis.createClient();
        await publisher.connect();
    });

    socket.on('data', function(data) {
        publisher.publish('main_chat_room', data.toString());
    });

    socket.on('end', function() {
        subscriber.unsubscribe('main_chat_room');
        subscriber.end();
        publisher.end();
    });
});

server.listen(8888);