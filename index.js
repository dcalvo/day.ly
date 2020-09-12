const puppeteer = require("puppeteer");
const creds = require("./creds");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://blackboard.jhu.edu/webapps/login/");
  if (page.url() === "https://blackboard.jhu.edu/webapps/login/") {
    await page.click("#loginBox-JHU > h2 > a:nth-child(5)");
    console.log(page.url());
    await page.waitForSelector("#i0116");
    await page.type("#i0116", creds.username);
    await page.click("#idSIButton9");
    await page.waitFor(2000);
    await page.type("#i0118", creds.password);
    await page.click("#idSIButton9");
    await page.waitFor(2000);
  }
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
