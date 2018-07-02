"use strict";
/**
 * @class http Creates application server
 * @class helper Handles common http operations
 * @prop cache Holds cached files
 */
let http = require('http');
let express = require("express");
let chatModule = require("./app/ChatModule");
let app = express();
// Create Server
app.use(express.static('public'));
let server = http.createServer(app);
chatModule.listen(server);
server.listen(9000, () => console.log('Example app listening on port 9000!'));