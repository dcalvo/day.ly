const puppeteer = require("puppeteer");
const creds = require("../../creds");
const { ical_parse } = require("../utils/ical_parse");
const { writeToFile } = require("../utils/writeFile.js");

async function blackboard_scrape(count = 0) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://blackboard.jhu.edu/webapps/calendar/viewPersonal");
  // if the user isn't logged in
  if (page.url().includes("https://blackboard.jhu.edu/webapps/login/")) {
    await page.click("#loginBox-JHU > h2 > a:nth-child(5)"); // click log in
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("input[type='email']"); // username field
    await page.type("input[type='email']", creds.BlackBoard.username);
    await page.click("#idSIButton9"); // next
    await page.type("input[type='password']", creds.BlackBoard.password); // password field
    await page.waitFor(3000); // required wait time for JS
    await page.click("#idSIButton9"); // next
  }

  await page.waitForSelector("#ical", 5000);
  await page.click("#ical > span"); // generate ical url
  await page.waitForSelector("#icalurlid");
  await page.waitFor(500); // required wait time for JS
  const ical = await page.evaluate(
    () => document.querySelector("#icalurlid").textContent // get ical url
  );

  // download ical within browser context and extract it to our scope
  const getData = async () => {
    return await page.evaluate(async (ical) => {
      return await new Promise((resolve) => {
        fetch(ical, {
          method: "GET",
          credentials: "include",
        })
          .then((response) => response.blob())
          .then((blob) => resolve(blob.text()));
      });
    }, ical);
  };
  let icalData = await getData();

  // verify iCal integrity
  if (!icalData.includes("BEGIN:VCALENDAR")) {
    if (count >= 3) {
      throw "BlackBoard iCal retrieval failed!";
    }
    count++;
    console.log("iCal retrieval failed, retrying attempt #" + count + "...");
    icalData = await blackboard_scrape(count);
  }

  await browser.close();
  const parsedIcal = await ical_parse(icalData);
  //await writeToFile(parsedIcal, "../data/blackboard.txt");
  return JSON.stringify(parsedIcal);
}

exports.blackboard_scrape = blackboard_scrape;
