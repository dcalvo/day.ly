const puppeteer = require("puppeteer");
const creds = require("./creds");
const fs = require("fs");
const http = require("http");
const https = require("https");


async function getClasses(){

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.gradescope.com/login");
  await page.type("#session_email", creds.Gradescope.username);
  await page.type("#session_password", creds.Gradescope.password);
  await page.click("#box-main > div > form > div:nth-child(6) > input");
  await page.waitForNavigation({

    waitUntil: "networkidle0"

  });

  var classList = await page.$$('#account-show > div.courseList > div:nth-child(2) > .courseBox');
  for(var i = 0; i < classList.length - 1; i++){

    classList = await page.$$('#account-show > div.courseList > div:nth-child(2) > .courseBox');
    await classList[i].click();
    await page.waitForNavigation({

      waitUntil: "load"

    });

    var assignmentList = await page.$$('#assignments-student-table > tbody > tr');
    for(var j = 0; j < assignmentList.length; j++){

      var assignmentTitleShell = await assignmentList[j].$('th');
      try{
        var assignmentTitle = await assignmentTitleShell.$eval('a', element => element.innerHTML);
        // console.log(assignmentTitle);
      }
      catch{

      }

      var assignmentStatusShell = await assignmentList[j].$('td');
      var assignmentStatus = await assignmentStatusShell.$eval('div', element => element.innerHTML);
      // console.log(assignmentStatus);

      try{
        var dueDateShell = await assignmentList[j].$('td.sorting_1.sorting_2 > div > div');
        var dueDate = await dueDateShell.$eval('span.submissionTimeChart--dueDate', element => element.innerHTML);
        console.log(dueDate);
      }
      catch{

          
      }
      //#assignments-student-table > tbody > tr:nth-child(1) > td.sorting_1.sorting_2 > div > div > span.submissionTimeChart--dueDate

    }

    // await page.screenshot({path: `example${i}.png`});
    await page.goBack({

      waitUntil: "load"

    });

  }

  await browser.close();

}

getClasses();
