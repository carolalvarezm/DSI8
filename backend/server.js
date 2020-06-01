const PORT = 8081;
const HOST = "0.0.0.0";
const VERSION = "1.0";

const app = require("express")();

app.get("/", (req, res) => {
  res.send(`API VERSION ${VERSION}`);
});

app.get("/api/", (req, res) => {
    const data = require('./data.json')
    res.json(data);
  });

app.listen(PORT, HOST);
console.log(`Running NODE on http://localhost:${PORT} (private)`);