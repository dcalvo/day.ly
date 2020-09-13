const creds = require("../../creds");

async function gradescope_scrape(browser) {
  const page = await browser.newPage();
  await page.goto("https://www.gradescope.com/login");
  await page.waitFor(1000);
  if (page.url().includes("login")) {
    await page.waitForSelector("input[type='email']"); // username field
    await page.type("#session_email", creds.Gradescope.username);
    await page.type("#session_password", creds.Gradescope.password);
    await page.click("#box-main > div > form > div:nth-child(6) > input");
    await page.waitFor(1000);
  }

  let classList = await page.$$(
    "#account-show > div.courseList > div:nth-child(2) > .courseBox"
  );
  let assignmentData = [];
  for (let i = 0; i < classList.length - 1; i++) {
    // satisfy puppeteer execution context preservation
    classList = await page.$$(
      "#account-show > div.courseList > div:nth-child(2) > .courseBox"
    );
    const shortClassName = await classList[i].$eval("h3", (element) => {
      return element.innerText;
    });
    const className = await classList[i].$eval("h4", (element) => {
      return element.innerText;
    });

    await classList[i].click(); // enter the class
    await page.waitForSelector("#assignments-student-table");

    const assignmentList = await page.$$(
      "#assignments-student-table > tbody > tr"
    );
    for (let j = 0; j < assignmentList.length; j++) {
      let assignmentTitleShell = await assignmentList[j].$("th");

      // massive try-catch to get all edge cases for how gradescope stores titles
      let assignmentTitle;
      try {
        assignmentTitle = await assignmentTitleShell.$eval(
          "a",
          (element) => element.innerHTML
        );
      } catch {
        try {
          assignmentTitle = await assignmentTitleShell.$eval(
            "button",
            (element) => element.innerHTML
          );
        } catch {
          try {
            assignmentTitle = await assignmentList[j].$eval(
              "th",
              (element) => element.innerHTML
            );
          } catch {}
        }
      }

      // get dueDate from the ways they store it and parse it for format
      let dueDate;
      try {
        var dueDateShell = await assignmentList[j].$(
          "td.sorting_1.sorting_2 > div > .progressBar--caption"
        );
        dueDate = await dueDateShell.$eval(
          "span.submissionTimeChart--dueDate",
          (element) => element.innerHTML
        );
      } catch {
        dueDate = null;
      }

      if (dueDate != null) {
        var dateArray = gradescopeDate(dueDate);
        assignmentData.push({
          assignment: assignmentTitle,
          class: { className, shortClassName },
          dueDate: {
            month: dateArray[0],
            day: dateArray[1],
            hour: dateArray[2],
            minute: dateArray[3],
          },
          origin: "Gradescope",
        });
      }
    }

    // back to list of classes for next delve
    await page.goBack({
      waitUntil: "load",
    });
  }

  await page.close();
  return JSON.stringify(assignmentData);
}

// parse gradescope date into our format
function gradescopeDate(stringDate) {
  stringDate = stringDate.replace(" at", "");
  stringDate = stringDate.replace("  ", " ");
  dateArray = stringDate.split(" ");
  var month;
  switch (dateArray[0]) {
    case "Jan":
      month = 1;
      break;

    case "Feb":
      month = 2;
      break;

    case "Mar":
      month = 3;
      break;

    case "Apr":
      month = 4;
      break;

    case "May":
      month = 5;
      break;

    case "Jun":
      month = 6;
      break;

    case "Jul":
      month = 7;
      break;

    case "Aug":
      month = 8;
      break;

    case "Sep":
      month = 9;
      break;

    case "Oct":
      month = 10;
      break;

    case "Nov":
      month = 11;
      break;

    case "Dec":
      month = 12;
      break;
  }
  var date = dateArray[1];

  var timeArray = militaryTime(dateArray[2]);
  var hours = timeArray[0];
  var minutes = timeArray[1];

  var dateObject = new Date();
  var year = dateObject.getYear();
  return [month, date, year, hours, minutes];
}

// convert from 12hour time to 24hour time
function militaryTime(standardTime) {
  timeArray = standardTime.split(":");
  var hour = timeArray[0];
  var minute = timeArray[1].substring(0, 2);
  var pm = timeArray[1].substring(2, 4) == "PM" ? true : false;
  if (hour == "12") {
    hour = 0;
  }

  if (pm) {
    hour = parseInt(hour) + 12;
  }

  return [hour, minute];
}

exports.gradescope_scrape = gradescope_scrape;
