const puppeteer = require("puppeteer");
const creds = require("../creds");
const { downloadFromUrl } = require("./download_url");

async function blackboard_scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://blackboard.jhu.edu/webapps/calendar/viewPersonal");
  // if the user isn't logged in
  if (page.url().includes("https://blackboard.jhu.edu/webapps/login/")) {
    await page.click("#loginBox-JHU > h2 > a:nth-child(5)"); // click log in
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("#i0116"); // username field
    await page.type("#i0116", creds.username);
    await page.click("#idSIButton9"); // next
    await page.waitFor(2000);
    await page.type("#i0118", creds.password); // password field
    await page.click("#idSIButton9"); // submit
  }

  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });
  await page.waitFor(2000);
  await page.click("#ical > span"); // generate ical url
  await page.waitForSelector("#icalurlid");
  await page.waitFor(1000);
  const ical = await page.evaluate(
    () => document.querySelector("#icalurlid").textContent // get ical url
  );

  // oh my god please kill me
  const getData = async () => {
    return await page.evaluate(async (ical) => {
      return await new Promise((resolve) => {
        fetch(ical, {
          headers: {
            accept: "*/*",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "no-cors",
          },
          referrer: "https://blackboard.jhu.edu/webapps/calendar/viewPersonal",
          referrerPolicy: "no-referrer-when-downgrade",
          body: null,
          method: "GET",
          mode: "no-cors",
          credentials: "include",
        })
          .then((response) => response.blob())
          .then((blob) => resolve(blob.text()));
      });
    }, ical);
  };
  const icalData = await getData();
  await page.screenshot({ path: "example.png" });
  await browser.close();
  //downloadFromUrl(ical, "./ical.ics");
  return icalData;
}

exports.blackboard_scrape = blackboard_scrape;
