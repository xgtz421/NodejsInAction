const redis = require('redis');
(async () => {


    const client = redis.createClient();
    client.on('error', (err) => {
        console.log('Redis Client Error', err);
    });
    await client.connect();
    await client.set('color', 'blue', redis.print);
    const value = await client.get('color');
    console.log('client get color======>', value);

    try {
        await client.hSet('camping', 'shelter', '2-person tent' );
        await client.hSet('camping', 'cooking', 'campstove');
        const shelter = await client.hGet('camping', 'shelter');
        console.log('=========>', shelter);
        const cooking = await client.hGet('camping', 'cooking');
        console.log('=========>', cooking);
        const hmsetKeys = await client.hKeys('camping');
        console.log('=======>', hmsetKeys);
    } catch(err) {
        console.log(err);
    }

})()
// var client = redis.createClient(6379, '127.0.0.1');
// client.on('error', function(err) {
//     console.log('Error:', err);
// });
// client.set('color', 'red', redis.print);
// client.get('color', function(err, value) {
//     if (err) throw err;
//     console.log('Get:', value);
// });