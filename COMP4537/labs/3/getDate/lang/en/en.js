const MESSAGES = {
    greeting: "Hello %1, What a beautiful day. Server current date and time is: ",
    defaultName: "Guest",
    defaultText: "No text provided",
    awsRegionLog: "AWS Region:",
    successAppend: "Successfully appended to file: %1",
    errorWritingFile: "Error writing to file",
    errorReadingFile: "Error reading file",
    fileNotFound: "404: File not found",
    notFound: "404: Not Found",
    serverRunning: "Server is running locally on port %1"
};

const AWS_CONFIG = {
    endpoint: 'https://s3.us-east-2.amazonaws.com',
    bucketName: 'comp4537lab3bucket',
    fileName: 'file.txt'
};

const PATHS = {
    getDate: '/COMP4537/labs/3/getDate/',
    writeFile: '/COMP4537/labs/3/writeFile/',
    readFile: '/COMP4537/labs/3/readFile/file.txt'
};

module.exports = { MESSAGES, AWS_CONFIG, PATHS };
