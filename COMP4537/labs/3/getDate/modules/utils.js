function getDate() {
    // Get the current date and time
    const now = new Date();

    // Convert the time to the Pacific Time Zone using toLocaleString()
    const options = { timeZone: 'America/Los_Angeles', timeZoneName: 'short' };

    // Get the individual parts of the date and time
    const weekday = now.toLocaleString('en-US', { weekday: 'short', timeZone: 'America/Los_Angeles' });
    const month = now.toLocaleString('en-US', { month: 'short', timeZone: 'America/Los_Angeles' });
    const day = now.toLocaleString('en-US', { day: 'numeric', timeZone: 'America/Los_Angeles' });
    const year = now.toLocaleString('en-US', { year: 'numeric', timeZone: 'America/Los_Angeles' });
    const time = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' });

    // Get the time zone offset and name
    const timeZoneString = now.toLocaleTimeString('en-US', options).match(/\(([^)]+)\)$/)[1];
    const gmtOffset = now.toLocaleTimeString('en-US', options).match(/GMT([+-]\d{4})/)[1];

    // Construct the desired output
    return `${weekday} ${month} ${day} ${year} ${time} GMT${gmtOffset} (${timeZoneString})`;
}

module.exports = { getDate };
