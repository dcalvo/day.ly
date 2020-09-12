const puppeteer = require("puppeteer");
const creds = require("./creds");
const fs = require("fs");
const http = require("http");
const https = require("https");

/**
 * Downloads file from remote HTTP[S] host and puts its contents to the
 * specified location.
 */
async function downloadFromUrl(url, filePath) {
  const proto = !url.charAt(4).localeCompare("s") ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = proto.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      fileInfo = {
        mime: response.headers["content-type"],
        size: parseInt(response.headers["content-length"], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on("finish", () => resolve(fileInfo));

    request.on("error", (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on("error", (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}

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
  await page.click("#ical > span");
  await page.waitForSelector("#icalurlid");
  await page.waitFor(500);
  const ical = await page.evaluate(
    () => document.querySelector("#icalurlid").textContent
  );
  downloadFromUrl(ical, "./ical.ics");
  await page.screenshot({ path: "example.png" });
  await browser.close();
})();
