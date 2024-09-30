export default function handler(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const name = url.searchParams.get('name') || "Guest";
    const currentDate = new Date().toString();  // Assuming you just need a simple date for now

    const message = `Hello ${name}, What a beautiful day. Server current date and time is: ${currentDate}`;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`<div style="color:blue">${message}</div>`);
}
