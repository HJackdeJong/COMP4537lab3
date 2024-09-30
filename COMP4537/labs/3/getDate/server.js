const http = require('http');
const locals = require('./locals/en/en.js');
const { getDate } = require('./modules/utils.js');

http.createServer(function(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const name = url.searchParams.get('name') || "Guest";
    const currentDate = getDate();

    const message = locals.MESSAGES.message
        .replace("%1", name)
        .concat(currentDate);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<div style="color:blue">${message}</div>`);

}).listen(7000);

console.log("HTTP server is running");
