function getDate() {
    // Get the current date and time in the Pacific Time Zone (PST/PDT)
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

    // Create a Date object from the converted Pacific Time string
    const pacificDate = new Date(now);

    // Convert the date to a string, which will be in the format: 
    // "Wed Sep 01 2023 12:52:14 GMT+0000 (Coordinated Universal Time)"
    let dateString = pacificDate.toString();

    // Replace "+0000 (Coordinated Universal Time)" with "-0800 (Pacific Standard Time)"
    // You may also want to handle daylight saving time (PDT) here, depending on your requirements
    dateString = dateString.replace("GMT+0000 (Coordinated Universal Time)", "GMT-0800 (Pacific Standard Time)");

    return dateString;
}

module.exports = { getDate };
