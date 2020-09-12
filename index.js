const puppeteer = require("puppeteer");
const creds = require("./creds");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://blackboard.jhu.edu/webapps/login/");
  if (page.url() === "https://blackboard.jhu.edu/webapps/login/") {
    await page.click("#loginBox-JHU > h2 > a:nth-child(5)");
    console.log(page.url());
    await page.click("#i0116");
    await page.type(creds.username);
    await page.click("#idSIButton9");
    await page.click("#i0118");
    await page.type(creds.password);
    await page.click("#idSIButton9");
  }
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
