const http = require('http');
const url = require('url');
const { getDate } = require('./modules/utils');
const locals = require('./lang/en/en.js');

const server = http.createServer((req, res) => {
    // Parse the request URL to extract the 'name' query parameter
    const queryObject = url.parse(req.url, true).query;
    const name = queryObject.name || 'Guest';

    // Get the current server date and time
    const serverTime = getDate();

    // Replace placeholders in the greeting message
    // const message = GREETING_MESSAGE.replace('%1', name).replace('%2', serverTime);
    const message = locals.MESSAGES.message
    .replace("%1", name)
    .concat(serverTime);

    // Set the response headers and send the styled message
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<p style="color: blue;">${message}</p>`);
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
