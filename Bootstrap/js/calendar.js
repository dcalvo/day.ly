// fetches the current date
var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

// An array of each active column in the calendar
let cols = document.querySelectorAll(".calCol");

// Bolds the current day
for (var j = 0; j < cols.length; j++) {
  if (cols[j].querySelector("div").innerHTML == "" + today.getDate()) {
    cols[j].querySelector("div").id = "today";
    break;
  }
}

// Grab today and the next 6 days for week view
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var weekNames = new Array(7);
weekNames[0] = "Today";
for (var k = 1; k <= 6; k++) {
  var n = weekday[today.getDay() + k];
  weekNames[k] = n;
}

// Fill HTML with Today and next 6 days
let roots = document.getElementsByClassName("weekHeader");
roots[0].id = "today";
for (var q = 0; q < weekNames.length; q++) {
  roots[q].innerHTML = weekNames[q];
}

// Refresh function; populates calendar
document.getElementById("refresh").addEventListener("click", async function () {
  document.getElementById("refresh").src = "img/refresh.gif";
  document.getElementById("refresh").style.transform = "scale(1.5)";

  console.time("fetches");
  // begin loading here; perhaps grey out or just have cool loading thing from NATo project
  //   let [bbRequest, gsRequest, sisRequest] = await Promise.all([
  //     fetch("http://localhost:3000/api/blackboard"),
  //     fetch("http://localhost:3000/api/gradescope"),
  //     fetch("http://localhost:3000/api/sis"),
  //   ]);
  let [bbRequest, gsRequest] = await Promise.all([
    fetch("http://localhost:3000/api/blackboard"),
    fetch("http://localhost:3000/api/gradescope"),
  ]);
  console.timeEnd("fetches");

  let bb = await bbRequest.json();
  let gs = await gsRequest.json();
  //let sis = await sisRequest.json();

  //console.log(sis);
  console.log(gs);

  // Blackboard calendar fill
  for (var i = 0; i < bb.length; i++) {
    if (
      today.getFullYear() == bb[i].dueDate.year &&
      today.getMonth() + 1 == bb[i].dueDate.month
    ) {
      // Instantiating all HTML elements

      let assignment = bb[i].assignment;
      let time = bb[i].dueDate;
      let div = cols[bb[i].dueDate.day - 1].getElementsByClassName(
        "calTaskWrapper"
      )[0];
      let task = document.createElement("div");
      let taskContent = document.createElement("div");
      let taskTime = document.createElement("div");
      let taskTitle = document.createElement("div");

      // Setting all classes for stylization

      task.className = "calTaskCard";
      taskContent.className = "calTaskContent";
      taskTime.className = "taskTime";
      taskTitle.className = "taskTitle";
      taskTitle.innerHTML = assignment;

      // Converting time to string
      var timeString = "";
      if (time.hour == 12) {
        if (time.minute !== "00") {
          timeString = "" + 12 + ":" + time.minute + "PM";
        } else {
          timeString = "" + 12 + ":" + "00" + "PM";
        }
      } else {
        if (time.hour < 12) {
          if (time.minute !== "00") {
            timeString = "" + time.hour + ":" + time.minute + "AM";
          } else {
            timeString = "" + time.hour + ":" + "00" + "AM";
          }
        } else {
          if (time.minute !== "00") {
            timeString = "" + (time.hour - 12) + ":" + time.minute + "PM";
          } else {
            timeString = "" + (time.hour - 12) + ":" + "00" + "PM";
          }
        }
      }
      taskTime.innerHTML = timeString;

      // Appending new elements to calendar div
      taskContent.appendChild(taskTime);
      taskContent.appendChild(taskTitle);
      task.appendChild(taskContent);
      div.appendChild(task);

      // Populate week-view

      if (
        bb[i].dueDate.day >= today.getDate() &&
        bb[i].dueDate.day <= today.getDate() + 6
      ) {
        // Instantiate new elements

        let weekDays = document.getElementsByClassName("weekDay");
        let structure = `<div class="card border-left-warning h-100 w-175 py-2">
                    <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">${assignment}</div>
                        <div class="row no-gutters align-items-center">
                            <div class="col-auto">
                            <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${timeString}</div>
                            </div>
                         </div>
                        </div>
                        <div class="col-auto">
                        <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                    </div>
                    </div>
                </div>`;
        for (var w = 0; w < weekDays.length; w++) {
          if (bb[i].dueDate.day == today.getDate() + w) {
            weekDays[w].innerHTML += structure;
          }
        }
      }
    }
  }

  // Gradescope calendar fill
  for (var i = 0; i < gs.length; i++) {
    if (today.getMonth() + 1 == gs[i].dueDate.month) {
      // Instantiating all HTML elements
      let assignment = gs[i].assignment;
      let time = gs[i].dueDate;
      let div = cols[gs[i].dueDate.day - 1].getElementsByClassName(
        "calTaskWrapper"
      )[0];
      let task = document.createElement("div");
      let taskContent = document.createElement("div");
      let taskTime = document.createElement("div");
      let taskTitle = document.createElement("div");

      // Setting all classes for stylization

      task.className = "calTaskCard";
      taskContent.className = "calTaskContent";
      taskTime.className = "taskTime";
      taskTitle.className = "taskTitle";
      taskTitle.innerHTML = assignment;

      // Converting time to string
      var timeString = "";
      if (time.hour == 12) {
        if (time.minute !== "00") {
          timeString = "" + 12 + ":" + time.minute + "PM";
        } else {
          timeString = "" + 12 + ":" + "00" + "PM";
        }
      } else {
        if (time.hour < 12) {
          if (time.minute !== "00") {
            timeString = "" + time.hour + ":" + time.minute + "AM";
          } else {
            timeString = "" + time.hour + ":" + "00" + "AM";
          }
        } else {
          if (time.minute !== "00") {
            timeString = "" + (time.hour - 12) + ":" + time.minute + "PM";
          } else {
            timeString = "" + (time.hour - 12) + ":" + "00" + "PM";
          }
        }
      }
      taskTime.innerHTML = timeString;

      // Appending new elements to calendar div
      taskContent.appendChild(taskTime);
      taskContent.appendChild(taskTitle);
      task.appendChild(taskContent);
      div.appendChild(task);

      // Populate week-view

      if (
        gs[i].dueDate.day >= today.getDate() &&
        gs[i].dueDate.day <= today.getDate() + 6
      ) {
        // Instantiate new elements

        let weekDays = document.getElementsByClassName("weekDay");
        let structure = `<div class="card border-left-warning h-100 w-175 py-2">
                    <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">${assignment}</div>
                        <div class="row no-gutters align-items-center">
                            <div class="col-auto">
                            <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">${timeString}</div>
                            </div>
                         </div>
                        </div>
                        <div class="col-auto">
                        <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                    </div>
                    </div>
                </div>`;
        for (var w = 0; w < weekDays.length; w++) {
          if (gs[i].dueDate.day == today.getDate() + w) {
            weekDays[w].innerHTML += structure;
          }
        }
      }
    }
  }

  document.getElementById("refresh").src = "img/refresh.png";
  document.getElementById("refresh").style.transform = "scale(1)";

  var date = new Date();
  var taskCards = document.getElementsByClassName("calTaskCard");
  for (var i = 0; i < taskCards.length; i++) {
    taskCards[i].style.cursor = "pointer";
    taskCards[i].addEventListener("click", function () {
      console.log("click!");
      var assignmentName = this.querySelector(".taskTitle").innerHTML;
      var dueDate =
        getMonthName(date.getMonth()) +
        " " +
        this.parentElement.parentElement.querySelector(".day").innerHTML +
        ", at " +
        this.querySelector(".taskTime").innerHTML;
      var card = `
        <div class="modBox">
          <div class="modContent">
            <div class="modTopBar">
              <p class="modTaskTitle">${assignmentName}</p>
              <span class="closeButton" onclick = "hide()"><sup>x</sup></span>
            </div>
            <p class="modDueDate">${dueDate}</p>
          </div>
        </div>`;
      document.getElementById("myModal").innerHTML = card;
      document.getElementById("myModal").style.display = "block";
    });
  }

  var weekTaskCards = document.getElementsByClassName("card");
  for(var i = 0; i < weekTaskCards.length; i++) {
    weekTaskCards[i].style.cursor = "pointer";
    weekTaskCards[i].addEventListener("click", function(){

      var assignmentName = this.querySelector('.text-xs').innerHTML;
      var dueDate = getMonthName(date.getMonth()) + " " +(date.getDate()+parseInt(this.parentElement.id)) + ", at " + this.querySelector('.h5').innerHTML;
      var card = `
        <div class="modBox">
          <div class="modContent">
            <div class="modTopBar">
              <p class="modTaskTitle">${assignmentName}</p>
              <span class="closeButton" onclick = "hide()"><sup>x</sup></span>
            </div>
            <p class="modDueDate">${dueDate}</p>
          </div>
        </div>`
      document.getElementById("myModal").innerHTML = card;
      document.getElementById("myModal").style.display = "block";
    });

  }
});

function hide() {
  document.getElementById("myModal").style.display = "none";
}

function getMonthName(monthNum) {
  switch (monthNum) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
  }
}
