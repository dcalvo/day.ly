const creds = require("../../creds");

async function sis_scrape(browser) {
  const page = await browser.newPage();
  await page.goto("https://sis.jhu.edu/");
  await page.click("#linkSignIn");
  await page.waitFor(2000); // required wait time for JS
  if (page.url().includes("microsoftonline")) {
    await page.waitForSelector("input[type='email']"); // username field
    await page.type("input[type='email']", creds.BlackBoard.username);
    await page.click("#idSIButton9"); // next
    await page.waitFor(2000); // required wait time for JS
    await page.type("input[type='password']", creds.BlackBoard.password); // password field
    await page.click("#idSIButton9"); // next
  }
  await page.waitFor(2000);
  if (page.url().includes("PendingNotifications")) {
    await page.click("#ctl00_contentPlaceHolder_btnContinueToIsis");
  }
  await page.waitForSelector(
    "#aspnetForm > div:nth-child(4) > nav.navbar.navbar-custom > div > ul.nav.navbar-nav.navbar-left > li:nth-child(1)"
  );

  // activate dropdown
  await page.hover(
    "#aspnetForm > div:nth-child(4) > nav.navbar.navbar-custom > div > ul.nav.navbar-nav.navbar-left > li:nth-child(1)"
  );

  // click my class schedule
  await page.click(
    "#aspnetForm > div:nth-child(4) > nav.navbar.navbar-custom > div > ul.nav.navbar-nav.navbar-left > li:nth-child(1) > ul > li:nth-child(6) > a"
  );

  // Get student's class IDs and titles
  await page.waitForSelector(
    "#ctl00_contentPlaceHolder_DGStudClassSchedule > tbody",
    { timeout: 10000 }
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

  await page.close();
  return JSON.stringify(classes);
}

exports.sis_scrape = sis_scrape;
