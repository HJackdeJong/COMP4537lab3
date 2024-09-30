const MESSAGES = {
    message: "Hello %1, What a beautiful day. Server current data and time is: ",
    
    PATHS: {
        getDate: '/COMP4537/labs/3/getDate/',
        writeFile: '/COMP4537/labs/3/writeFile/',
        readFile: '/COMP4537/labs/3/readFile/file.txt'
    },

    LOGS: {
        serverRunning: 'Server is running locally on port %s',
        awsRegion: 'AWS Region:'
    },

    SUCCESS: {
        fileAppended: 'Successfully appended to file: %s'
    },

    ERROR: {
        notFound: '404: Not Found',
        fileNotFound: '404: File not found',
        fileRead: 'Error reading file',
        fileWrite: 'Error writing to file'
    }
};

module.exports = MESSAGES;
