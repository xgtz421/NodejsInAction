var http = require('http');
var url = require('url');
var items = [];
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/key-cert.pem') 
};

var server = http.createServer(function(req, res){
    req.setEncoding('utf-8');
    switch(req.method) {
        case 'POST':
            var item = '';
            req.on('data', function(chunk) {
                item += chunk;
            })
            req.on('end', function() {
                items.push(item);
                res.end('OK\n');
            });
            break;
        case 'GET':
            var body = items.map((item, i) => {
                return `${i})${item}`;
            }).join('\n');
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-Type', 'text/plain;charset="utf-8"');
            res.end(body);
            break;
        case 'DELETE':
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);
            if (isNaN(i)) {
                res.statusCode = 404;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not found');
            } else {
                items.splice(i, 1);
                res.end('OK\n');
            }
            break;
        
    }
});

// var server = https.createServer(options, function(req, res){
//     req.setEncoding('utf-8');
//     switch(req.method) {
//         case 'POST':
//             var item = '';
//             req.on('data', function(chunk) {
//                 item += chunk;
//             })
//             req.on('end', function() {
//                 items.push(item);
//                 res.end('OK\n');
//             });
//             break;
//         case 'GET':
//             var body = items.map((item, i) => {
//                 return `${i})${item}`;
//             }).join('\n');
//             res.setHeader('Content-Length', Buffer.byteLength(body));
//             res.setHeader('Content-Type', 'text/plain;charset="utf-8"');
//             res.end(body);
//             break;
//         case 'DELETE':
//             var path = url.parse(req.url).pathname;
//             var i = parseInt(path.slice(1), 10);
//             if (isNaN(i)) {
//                 res.statusCode = 404;
//                 res.end('Invalid item id');
//             } else if (!items[i]) {
//                 res.statusCode = 404;
//                 res.end('Item not found');
//             } else {
//                 items.splice(i, 1);
//                 res.end('OK\n');
//             }
//             break;
        
//     }
// });

server.listen(8888);