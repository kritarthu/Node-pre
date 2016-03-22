/**
 * Created by kupadhy on 3/19/16.
 */
"use strict";
var http = require("http");
var fs = require("fs");
var request = require("request");
var argv = require("yargs").argv;
var scheme = 'http://';
var host = argv.host;
var port = argv.port;
var destinationUrl = scheme + host + ':' + port;
var logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout;

var echoServer = http.createServer(function (req, res) {
    logStream.write("Inside echo server\n");
    for (var header in req.headers) {
        logStream.write("Echo server headers recieved" + header.toString());
        res.setHeader(header, req.headers[header]);
    }
    logStream.write(JSON.stringify(req.headers) + "\n");
    console.log("Echo Server returning response..\n");
    req.pipe(res);
});
echoServer.listen(8000);

var proxyServer = http.createServer(function (req, res) {
    logStream.write("Inside proxy server\n");
    if (req.headers['x-destination-url']) {
        logStream.write("x-destination-url header found \n");
        destinationUrl = scheme + req.headers['x-destination-url'];
    }
    var options = {
        url: destinationUrl + req.url,
        method: req.method
    };
    //headers: req.headers
    logStream.write("Sending request to " + JSON.stringify(options) + "\n");
    req.pipe(request(options)).pipe(res);
});
proxyServer.listen(9000);

//# sourceMappingURL=index-compiled.js.map