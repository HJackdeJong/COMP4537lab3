function getDate() {
    // Get the current date and time
    const now = new Date();

    // Get the UTC time and offset it by -8 hours for Pacific Standard Time (PST)
    const options = {
        timeZone: 'America/Los_Angeles',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };

    // Get the date string in PST format
    const pstDate = now.toLocaleString('en-US', options);

    // Get the GMT offset manually
    const gmtOffset = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour12: false, timeZoneName: 'short' });

    // Combine both results manually to get the full string
    return `${pstDate} GMT${gmtOffset.match(/GMT([\+\-]\d+)/)[1]} (${gmtOffset.match(/\(([^)]+)\)$/)[1]})`;
}

module.exports = { getDate };
