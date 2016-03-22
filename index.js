/**
 * Created by kupadhy on 3/19/16.
 */
"use strict"
let http = require("http")
let fs = require("fs")
let request = require("request")
let argv = require("yargs").argv
let scheme = 'http://'
let host = argv.host
let port = argv.port
let destinationUrl = scheme + host + ':' + port
let logStream = argv.logfile? fs.createWriteStream(argv.logfile):process.stdout

let echoServer = http.createServer(function (req, res){
    logStream.write("Inside echo server\n");
    for (let header in req.headers) {
        logStream.write("Echo server headers recieved" + header.toString());
        res.setHeader(header, req.headers[header]);
    }
    logStream.write(JSON.stringify(req.headers)+"\n");
    console.log("Echo Server returning response..\n")
    req.pipe(res)
});
echoServer.listen(8000)


let proxyServer = http.createServer(function (req, res) {
    logStream.write("Inside proxy server\n");
    if(req.headers['x-destination-url']) {
        logStream.write("x-destination-url header found \n");
        destinationUrl = scheme+req.headers['x-destination-url'];
    }
    let options = {
        url: destinationUrl + req.url,
        method: req.method,
        //headers: req.headers
    }
    logStream.write("Sending request to "+ JSON.stringify(options)+"\n");
    req.pipe(request(options)).pipe(res)
})
proxyServer.listen(9000)
