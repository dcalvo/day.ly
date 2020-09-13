const express = require("express");
const puppeteer = require("puppeteer");
const { getGroupmeMessages } = require("./backend/messaging/groupme");
const { blackboard_scrape } = require("./backend/scrape/blackboard_scrape");
const { gradescope_scrape } = require("./backend/scrape/gradescope_scrape");
const { sis_scrape } = require("./backend/scrape/sis_scrape");

const app = express();
const port = 3000;

let GROUPME_USER_TOKEN = null;

app.use(express.static("Bootstrap"));

app.listen(port, () => {
  console.log(`Website launched at http://localhost:${port}`);
});

let browser;
(async () => {
  browser = await puppeteer.launch();
})();

// get user's groupme token
app.get("/oauth/groupme", async function (req, res) {
  GROUPME_USER_TOKEN = req.query.access_token;
  res.redirect("../index.html");
});

// send latest groupme message previews
app.get("/api/groupme", async function (req, res) {
  console.log(GROUPME_USER_TOKEN);
  if (GROUPME_USER_TOKEN != null) {
    res.send(await getGroupmeMessages(GROUPME_USER_TOKEN));
  } else {
    res.send("GROUPME_USER_TOKEN NOT SET");
  }
});

// send blackboard scrape data
app.get("/api/blackboard", async function (req, res) {
  console.log("Scraping BlackBoard...");
  res.send(await blackboard_scrape(browser));
});

// send gradescope scrape data
app.get("/api/gradescope", async function (req, res) {
  console.log("Scraping Gradescope...");
  res.send(await gradescope_scrape(browser));
});

// send SIS scrape data
app.get("/api/sis", async function (req, res) {
  console.log("Scraping SIS...");
  res.send(await sis_scrape(browser));
});
