function getDate() {
    const now = new Date();

    // Convert the date to the Pacific Time Zone as a string in the correct format
    const options = { timeZone: 'America/Los_Angeles', timeZoneName: 'long' };
    const dateInPST = now.toLocaleString('en-US', options);

    // Extract the relevant parts from the current date in the Pacific Time Zone
    const pacificDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

    // Return the full string, including GMT offset and Pacific Time Zone name
    return pacificDate.toString(); // Outputs in full format including GMT offset and timezone name (PST/PDT)
}

module.exports = { getDate };
