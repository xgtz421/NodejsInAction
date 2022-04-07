var fs = require('fs')
    , watchDir = './watch'
    , processedDir = './done';
var events = require('events')
    , util = require('util');

function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}    

util.inherits(Watcher, events.EventEmitter);
// Watcher.prototype = new events.EventEmitter();

Watcher.prototype.watch = function() {
    const watcher = this;
    fs.readdir(this.watchDir, function(err, files) {
        if (err) throw err;
        // for in 不会忽略数组的非数字属性，因此不推荐使用
        for(let index in files) {
            watcher.emit('process', files[index]);
        }
    })
}

Watcher.prototype.start = function() {
    const watcher = this;
    fs.readFile(this.watchDir, function() {
        watcher.watch();
    });
}

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function(file) {
    var watchFile = `${this.watchDir}/${file}`;
    var processedFile = `${this.processedDir}/${file.toLowerCase()}`;
    fs.rename(watchFile, processedFile, function(err) {
        if (err) throw err;
    });
});

watcher.start();