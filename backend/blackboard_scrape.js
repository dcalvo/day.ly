const puppeteer = require("puppeteer");
const creds = require("../creds");
const download = require("./download_url");
(async () => {
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
  console.log(ical);
  download.downloadFromUrl(ical, "./ical.ics");
  await page.screenshot({ path: "example.png" });
  await browser.close();
})();
