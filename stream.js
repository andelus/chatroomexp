"use strict";
var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    fs.createReadStream('./profile.jpg').pipe(res);
}).listen(9000);

console.log("listening on 9000");