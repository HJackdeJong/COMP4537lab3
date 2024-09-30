const http = require('http');
const url = require('url');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getDate } = require('./modules/utils');
const locals = require('./lang/en/en.js');
const MESSAGES = require('./lang/en/messages.js');
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

const bucketName = MESSAGES.bucketName;
const fileName = MESSAGES.fileName;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/COMP4537/labs/3/getDate/') {
        const name = query.name || MESSAGES.defaultName;
        const serverTime = getDate();
        const message = locals.MESSAGES.message.replace('%1', name).concat(serverTime);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);

    } else if (pathname === '/COMP4537/labs/3/writeFile/') {
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
                res.end(MESSAGES.successFileWrite.replace('%s', textToWrite));
            })
            .catch(err => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(MESSAGES.errorFileWrite);
            });

    } else if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
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
                    res.end(MESSAGES.errorFileNotFound);
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(MESSAGES.errorFileRead);
                }
            });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(MESSAGES.errorNotFound);
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
