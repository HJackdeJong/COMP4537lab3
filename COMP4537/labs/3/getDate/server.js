const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { getDate } = require('./modules/utils');

const PORT = process.env.PORT || 8000;

// Handle requests and routes
function requestHandler(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.searchParams;

    if (pathname === '/getDate/') {
        const name = query.get('name') || 'Guest';
        const currentTime = getDate();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">Hello ${name}, what a beautiful day! Server current date and time is ${currentTime}</p>`);

    } else if (pathname === '/writeFile/') {
        const text = query.get('text') || '';
        
        // Check if running on Vercel or locally
        const isVercel = process.env.VERCEL_ENV !== undefined;
        
        // For local testing, write to the project directory
        const filePath = isVercel ? path.join('/tmp', 'file.txt') : path.join(__dirname, 'file.txt');
        
        fs.appendFile(filePath, `${text}\n`, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error writing to file');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Text added to file successfully');
        });

    } else if (pathname === '/readFile/file.txt') {
        const isVercel = process.env.VERCEL_ENV !== undefined;
        const filePath = isVercel ? path.join('/tmp', 'file.txt') : path.join(__dirname, 'file.txt');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end('File not found');
                }
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error reading from file');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Not Found');
    }
}

// Start the server locally or export for Vercel
if (require.main === module) {
    const server = http.createServer(requestHandler);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} else {
    module.exports = requestHandler;
}
