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

// instantiate shared browser
let browser;
(async () => {
  browser = await puppeteer.launch();
})();

/* OAUTH ROUTES */

// get user's groupme token
app.get("/oauth/groupme", async function (req, res) {
  GROUPME_USER_TOKEN = req.query.access_token;
  res.redirect("../index.html");
});

/* API ROUTES */

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
  let scrapeData = await retry(blackboard_scrape, browser);
  res.send(scrapeData);
});

// send gradescope scrape data
app.get("/api/gradescope", async function (req, res) {
  console.log("Scraping Gradescope...");
  let scrapeData = await retry(gradescope_scrape, browser);
  res.send(scrapeData);
});

// send SIS scrape data
app.get("/api/sis", async function (req, res) {
  console.log("Scraping SIS...");
  let scrapeData = await retry(sis_scrape, browser);
  res.send(scrapeData);
});

async function retry(scraper, browser, maxRetries = 3) {
  return scraper(browser).catch((err) => {
    if (maxRetries <= 0) {
      throw err;
    }
    console.log(`Error in scraper ${scraper.name}:`);
    console.log(err);
    console.log(`Retrying with ${maxRetries} attempts remaining...`);
    return retry(scraper, browser, maxRetries - 1);
  });
}
