const { getDate } = require('../modules/utils');
const locals = require('../locals/en/en.js');


export default function handler(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const name = url.searchParams.get('name') || "Guest";
    const currentDate = getDate();

    const message = locals.MESSAGES.message.replace("%1", name).concat(currentDate);

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`<div style="color:blue">${message}</div>`);
}
