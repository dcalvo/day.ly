const express = require("express");
const { getGroupmeMessages } = require("./backend/messaging/groupme");

const app = express();
const port = 3000;

let GROUPME_USER_TOKEN = null;

app.use(express.static("Bootstrap"));

app.listen(port, () => {
  console.log(`Website launched at http://localhost:${port}`);
});

app.get("/oauth/groupme", async function (req, res) {
  GROUPME_USER_TOKEN = req.query.access_token;
  res.redirect("../index.html");
});

app.get("/api/groupme", async function (req, res) {
  console.log(GROUPME_USER_TOKEN);
  if (GROUPME_USER_TOKEN != null)
    res.send(await getGroupmeMessages(GROUPME_USER_TOKEN));
  else res.send("GROUPME_USER_TOKEN NOT SET");
});
