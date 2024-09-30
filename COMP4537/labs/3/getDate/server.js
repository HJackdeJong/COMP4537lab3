const http = require('http');
const url = require('url');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getDate } = require('./modules/utils');
const locals = require('./lang/en/en.js');
const MESSAGES = require('./lang/en/messages.js'); // Added MESSAGES import
require('dotenv').config();

// Configure the S3 Client using environment variables
const s3 = new S3Client({
    region: 'us-east-2', // Ensure this is the correct region for your bucket
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: `https://s3.us-east-2.amazonaws.com`,
});

const bucketName = 'comp4537lab3bucket';
const fileName = 'file.txt';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === MESSAGES.PATHS.getDate) {
        const name = query.name || 'Guest';
        const serverTime = getDate();
        const message = locals.MESSAGES.message.replace('%1', name).concat(serverTime);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);

    } else if (pathname === MESSAGES.PATHS.writeFile) {
        console.log(MESSAGES.LOGS.awsRegion, process.env.AWS_REGION);
        const textToWrite = query.text || '';

        // Read the file from S3
        s3.send(new GetObjectCommand({ Bucket: bucketName, Key: fileName }))
            .then(data => {
                // Convert the Body stream to a string
                return streamToString(data.Body);
            })
            .then(currentContent => {
                const updatedContent = currentContent + `\n${textToWrite}`;

                // Write the updated content back to S3
                return s3.send(new PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: updatedContent,
                    ContentType: 'text/plain',
                }));
            })
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(MESSAGES.SUCCESS.fileAppended.replace('%s', textToWrite));
            })
            .catch(err => {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(MESSAGES.ERROR.fileWrite);
            });

    } else if (pathname === MESSAGES.PATHS.readFile) {
        // Read the file from S3
        s3.send(new GetObjectCommand({ Bucket: bucketName, Key: fileName }))
            .then(data => {
                return streamToString(data.Body);
            })
            .then(content => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(content);
            })
            .catch(err => {
                if (err.name === 'NoSuchKey') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end(MESSAGES.ERROR.fileNotFound);
                } else {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(MESSAGES.ERROR.fileRead);
                }
            });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(MESSAGES.ERROR.notFound);
    }
});

// Utility function to convert a stream to a string
function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on('error', reject);
    });
}

// Conditional for local testing
if (require.main === module) {
    const PORT = 3000;
} else {
    module.exports = server;
}
