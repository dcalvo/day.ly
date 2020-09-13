const puppeteer = require("puppeteer");
const creds = require("../../creds");

async function sis_scrape(count = 0) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://sis.jhu.edu/sswf/Framework/Authentication/UserGroups.aspx"
  );
  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });

  // Navigate to student's enrollment summary
  await page.waitForSelector("input[type='email']"); // username field
  await page.type("input[type='email']", creds.BlackBoard.username);
  await page.click("#idSIButton9"); // next
  await page.type("input[type='password']", creds.BlackBoard.password); // password field
  await page.waitFor(3000); // required wait time for JS
  await page.click("#idSIButton9"); // submit
  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });
  await page.goto(
    "https://sis.jhu.edu/sswf/SSS/EntityClassSchedule/SSS_StudentClassScheduleOverView.aspx" // first time we get redirected
  );
  await page.goto(
    "https://sis.jhu.edu/sswf/SSS/EntityClassSchedule/SSS_StudentClassScheduleOverView.aspx" // second time we get the summary view
  );

  // Get student's class IDs and titles
  await page.screenshot({ path: "./screenshot.png" });
  await page.waitForSelector(
    "#ctl00_contentPlaceHolder_DGStudClassSchedule > tbody",
    { timeout: 5000 }
  );
  const table = await page.$$(
    "#ctl00_contentPlaceHolder_DGStudClassSchedule > tbody > tr"
  );
  let classes = [];
  // i = 1, skip header row
  for (let i = 1; i < table.length; i++) {
    const id = await table[i].$eval("td", (element) => element.innerHTML);
    const idNoSection = id.substring(0, id.length - 5);
    let title = await table[i].$eval(
      "td:nth-child(2) > a",
      (element) => element.innerHTML
    );
    title = title.substring(0, title.length - 4);
    classes.push({ aliases: [title, idNoSection, id] });
  }

  await browser.close();
  return classes;
}

exports.sis_scrape = sis_scrape;
