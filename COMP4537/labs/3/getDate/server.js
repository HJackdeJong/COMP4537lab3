const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const os = require('os');  // Import the os module
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
        
        // Use os.tmpdir() to get the temporary directory, cross-platform compatible
        const filePath = path.join(os.tmpdir(), 'file.txt');
        
        fs.appendFile(filePath, `${textToWrite}\n`, (err) => {
            if (err) {
                console.error('Error writing to file:', err);  // Log the error to the console
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end(`Error writing to file: ${err.message}`);  // Return the error message to the client
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Successfully appended to file: ${textToWrite}`);
        });

    } else if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
        const filePath = path.join(os.tmpdir(), 'file.txt');

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

// Conditional for local testing
if (require.main === module) {
    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
} else {
    module.exports = server;
}
