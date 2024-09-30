const http = require('http');
const url = require('url');
const dotenv = require('dotenv');
const { getDate } = require('./modules/utils');
const locals = require('./lang/en/en.js');

// Load environment variables from .env for local testing
dotenv.config();

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Dynamically import Octokit when needed
    const { Octokit } = await import('@octokit/rest');
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    if (pathname === '/COMP4537/labs/3/getDate/') {
        const name = query.name || 'Guest';
        const serverTime = getDate();  // Your original getDate function
        const message = locals.MESSAGES.message.replace('%1', name).concat(serverTime);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);

    } else if (pathname === '/COMP4537/labs/3/writeFile/') {
        const textToWrite = query.text || '';

        appendToGist(octokit, textToWrite)
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Successfully appended to file: ${textToWrite}`);
            })
            .catch(err => {
                console.error('Error writing to Gist:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error writing to file');
            });

    } else if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
        readGist(octokit)
            .then(content => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(content);
            })
            .catch(err => {
                console.error('Error reading from Gist:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading file');
            });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Not Found');
    }
});

async function appendToGist(octokit, newContent) {
    try {
        const gist = await octokit.gists.get({ gist_id: process.env.GIST_ID });
        const currentContent = gist.data.files['file.txt'].content;
        const updatedContent = currentContent + '\n' + newContent;

        await octokit.gists.update({
            gist_id: process.env.GIST_ID,
            files: {
                'file.txt': {
                    content: updatedContent,
                },
            },
        });
    } catch (error) {
        throw new Error('Error appending to Gist: ' + error.message);
    }
}

async function readGist(octokit) {
    try {
        const gist = await octokit.gists.get({ gist_id: process.env.GIST_ID });
        return gist.data.files['file.txt'].content;
    } catch (error) {
        throw new Error('Error reading Gist: ' + error.message);
    }
}

// Conditional for local testing
if (require.main === module) {
    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
} else {
    module.exports = server;
}
