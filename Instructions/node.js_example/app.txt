'use strict';
var http = require('http');
var fs = require('fs');
var numberOfRequests = 0;
http.createServer(function (request, responce) {
    request.n = numberOfRequests;
    console.log('Request number ' + numberOfRequests + ' recioved!');
  
    setTimeout(function () {
        fs.readFile('app.js', function (err, contents) {
            responce.writeHead(200, {'Content-type':'text/plain'});
            responce.write(contents +"\n"+ request.n+"\n");
            console.log("Responce to the request# " + request.n);
            responce.end();
        });
        
    }, 2000);
   
    numberOfRequests++;
}
).listen(8080);
console.log('listening ...');