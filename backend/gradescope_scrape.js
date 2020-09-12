const puppeteer = require("puppeteer");
const creds = require("../creds");
const fs = require("fs");
const http = require("http");
const https = require("https");


async function getAssignments(){

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
  var assignmentData = [];
  for(var i = 0; i < classList.length - 1; i++){

    classList = await page.$$('#account-show > div.courseList > div:nth-child(2) > .courseBox');
    await classList[i].click();
    await page.waitForNavigation({

      waitUntil: "load"

    });

    var classNameShell = await page.$('#main-content > div.l-contentWrapper > div > header');
    var className = await classNameShell.$eval('.courseHeader--title', element => element.innerHTML);
    console.log(className);

    var assignmentList = await page.$$('#assignments-student-table > tbody > tr');
    for(var j = 0; j < assignmentList.length; j++){

      var assignmentTitleShell = await assignmentList[j].$('th');
      var assignmentTitle;
      try{
        assignmentTitle = await assignmentTitleShell.$eval('a', element => element.innerHTML);
        console.log(assignmentTitle);
      }
      catch{

        try{
          assignmentTitle = await assignmentTitleShell.$eval('button', element => element.innerHTML);
          console.log(assignmentTitle);
        }
        catch{

          try{
            assignmentTitle = await assignmentList[j].$eval('th', element => element.innerHTML);
            console.log(assignmentTitle);
          }
          catch{

            console.log("bad title");

          }

        }

      }

      var dueDate;
      try{
        var dueDateShell = await assignmentList[j].$('td.sorting_1.sorting_2 > div > .progressBar--caption');
        dueDate = await dueDateShell.$eval('span.submissionTimeChart--dueDate', element => element.innerHTML);
        console.log("Due:" + dueDate);
      }
      catch{
          dueDate = null;
          console.log("bad date");
      }



      if(dueDate != null){
        var dateArray = gradescopeDate(dueDate);
        assignmentData.push({

          assignment: assignmentTitle,
          class: className,
          dueDate: {

            month:dateArray[0],
            day:dateArray[1],
            hour:dateArray[2],
            minute:dateArray[3]

          },
          origin: "Gradescope"

        });
      }
    }

    await page.goBack({

      waitUntil: "load"

    });

  }

  await browser.close();

  return assignmentData;

}

// getClasses();
function gradescopeDate(stringDate){

  stringDate = stringDate.replace(" at", "");
  stringDate = stringDate.replace('  ',' ');
  dateArray = stringDate.split(" ");
  var month;
  switch(dateArray[0]){

    case 'Jan':
      month = 1;
      break;

    case 'Feb':
      month = 2;
      break;

    case 'Mar':
      month = 3;
      break;

    case 'Apr':
      month = 4;
      break;

    case 'May':
      month = 5;
      break;

    case 'Jun':
      month = 6;
      break;

    case 'Jul':
      month = 7;
      break;

    case 'Aug':
      month = 8;
      break;

    case 'Sep':
      month = 9;
      break;

    case 'Oct':
      month = 10;
      break;

    case 'Nov':
      month = 11;
      break;

    case 'Dec':
      month = 12;
      break;
  }
  var date = dateArray[1];

  var timeArray = militaryTime(dateArray[2])
  var hours = timeArray[0];
  var minutes = timeArray[1];

  var dateObject = new Date();
  var year = dateObject.getYear();
  return [month, date, year, hours, minutes];


}


function militaryTime(standardTime){

  timeArray = standardTime.split(":");
  var hour = timeArray[0];
  var minute = timeArray[1].substring(0,2);
  var pm = timeArray[1].substring(2,4) == "PM" ? true : false;
  if(hour == "12"){

    hour = 0;

  }

  if(pm){

    hour = parseInt(hour) + 12;

  }

  return [hour, minute];

}

function writeToFile(assignments, fileName){
  var json = JSON.stringify(assignments);
  fs.writeFile(fileName,json, (err) => {

    if(err) throw err;

  });
}

async function writeAssignments(){

  var assignments = await getAssignments();
  writeToFile(assignments, "gradescope.txt");

}
