function getDate() {
    const now = new Date();

    return now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
}

module.exports = { getDate };