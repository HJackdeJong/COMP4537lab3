const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { getDate } = require('./modules/utils');

const PORT = process.env.PORT || 8000;

function serveStaticFiles(req, res, pathname) {
    const basePath = path.join(__dirname, '../public');
    let filePath = pathname === '/' ? '/index.html' : pathname;
    const fullPath = path.join(basePath, filePath);
    const ext = path.extname(fullPath).toLowerCase();

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] });
        res.end(data);
    });
}

function requestHandler(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.searchParams;

    if (pathname === '/getDate/') {
        const name = query.get('name') || 'Guest';
        const currentTime = getDate();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`Hello ${name}, what a beautiful day! Server current date and time is ${currentTime}`);
    } else if (pathname === '/writeFile/') {
        const text = query.get('text') || '';
        const filePath = path.join(__dirname, 'file.txt');  // Writing to file.txt in the current directory

        // Append text to file.txt
        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500);
                res.end('Error writing to file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('Text added to file successfully');
            }
        });
    } else if (pathname === '/readFile/file.txt') {
        const filePath = path.join(__dirname, 'file.txt');

        // Read from file.txt
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Error reading from file');
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Not Found');
    }
}

if (require.main === module) {
    const server = http.createServer(requestHandler);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} else {
    module.exports = requestHandler;
}

const mimeTypes = {
    '.html': 'text/html',
    '.txt': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};
