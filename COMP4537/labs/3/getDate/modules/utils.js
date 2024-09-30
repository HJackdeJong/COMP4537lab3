function getDate() {
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const pacificDate = new Date(now);

    let dateString = pacificDate.toString();

    const isDST = pacificDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', timeZoneName: 'short' }).includes('PDT');

    if (isDST) {
        dateString = dateString.replace("GMT+0000 (Coordinated Universal Time)", "GMT-0700 (Pacific Daylight Time)");
    } else {
        dateString = dateString.replace("GMT+0000 (Coordinated Universal Time)", "GMT-0800 (Pacific Standard Time)");
    }

    return dateString;
}

module.exports = { getDate };
