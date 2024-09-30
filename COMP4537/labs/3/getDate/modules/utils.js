function getDate() {
    const now = new Date();

    // Convert the date to the Pacific Time Zone
    const options = { timeZone: 'America/Los_Angeles', hour12: false };
    const pacificDateString = now.toLocaleDateString('en-US', options);
    const pacificTimeString = now.toLocaleTimeString('en-US', { ...options, hour12: false });

    // Get the full detailed time in the desired format
    const pacificDetailedTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

    // Combine the date and time strings to match the desired format
    return pacificDetailedTime.toString(); // Returns in detailed format like: Wed Sep 01 2023 12:52:14 GMT-0800 (Pacific Daylight Time)
}

module.exports = { getDate };
