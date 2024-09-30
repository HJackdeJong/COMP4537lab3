const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { getDate } = require('./modules/utils');
const locals = require('./lang/en/en.js');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/COMP4537/labs/3/getDate/') {
        const name = query.name || 'Guest';
        const serverTime = getDate();
        const message = locals.MESSAGES.message.replace('%1', name).concat(serverTime);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);

    } else if (pathname === '/COMP4537/labs/3/writeFile/') {
        const textToWrite = query.text || '';

        // Path to file.txt in the current directory (project folder)
        const filePath = path.join(__dirname, 'file.txt');

        // Append the text to the file
        fs.appendFile(filePath, `${textToWrite}\n`, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error writing to file');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Successfully appended to file: ${textToWrite}`);
        });

    } else if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
        const filePath = path.join(__dirname, 'file.txt');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404: File not found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading file');
                }
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Not Found');
    }
});

if (require.main === module) {
    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
} else {
    module.exports = server;
}
