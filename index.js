const express = require("express");
const fileSystem = require("fs");
const path = require("path");

const { getGroupmeMessages } = require("./backend/messaging/groupme");
const { blackboard_scrape } = require("./backend/scrape/blackboard_scrape");
const { gradescope_scrape } = require("./backend/scrape/gradescope_scrape");

const app = express();
const port = 3000;

let GROUPME_USER_TOKEN = null;

app.use(express.static("Bootstrap"));

app.listen(port, () => {
  console.log(`Website launched at http://localhost:${port}`);
});

// get user's groupme token
app.get("/oauth/groupme", async function (req, res) {
  GROUPME_USER_TOKEN = req.query.access_token;
  res.redirect("../index.html");
});

// send latest groupme message previews
app.get("/api/groupme", async function (req, res) {
  console.log(GROUPME_USER_TOKEN);
  if (GROUPME_USER_TOKEN != null) {
    const messages = await getGroupmeMessages(GROUPME_USER_TOKEN);
    res.send(messages);
  } else {
    res.send("GROUPME_USER_TOKEN NOT SET");
  }
});

// send blackboard scrape data
app.get("/api/blackboard", async function (req, res) {
  const filePath = path.join(__dirname, "backend/data/blackboard.txt");

  if (!fileSystem.exists(filePath)) {
    blackboard_scrape();
  }

  const stat = fileSystem.statSync(filePath);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": stat.size,
  });

  const readStream = fileSystem.createReadStream(filePath);
  readStream.pipe(res);
});

// send gradescope scrape data
app.get("/api/gradescope", async function (req, res) {
  const filePath = path.join(__dirname, "backend/data/gradescope.txt");

  if (!fileSystem.exists(filePath)) {
    gradescope_scrape();
  }

  const stat = fileSystem.statSync(filePath);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": stat.size,
  });

  const readStream = fileSystem.createReadStream(filePath);
  readStream.pipe(res);
});
