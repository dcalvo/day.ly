const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("Bootstrap"));

app.listen(port, () => {
  console.log(`Website launched at http://localhost:${port}`);
});

app.get("/api", async function (req, res) {
  console.log(req.query.access_token);
});
