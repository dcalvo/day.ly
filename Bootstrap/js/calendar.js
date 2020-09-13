const e = require("express");

// fetches the current date
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
console.log(date);

// An array of each active column in the calendar
let cols = document.querySelectorAll(".calCol");

// Bolds the current day
for (var j = 0; j < cols.length; j++) {
    if (cols[j].querySelector("div").innerHTML == ("" + today.getDate())) {
        cols[j].querySelector("div").id = "today";
        break;
    }
}

// Refresh function; populates calendar
document.getElementById("refresh").addEventListener("click", async function () {

    // begin loading here; perhaps grey out or just have cool loading thing from NATo project

    let bbRequest = await fetch("http://localhost:3000/api/blackboard");
    let gsRequest = await fetch("http://localhost:3000/api/gradescope");

    bb = JSON.parse(bbRequest);
    gs = JSON.parse(gsRequest);

    // Blackboard calendar fill
    for (var i = 0; i < bb.length; i++) {

        if ((today.getFullYear == bb[i].dueDate.year) && (today.getMonth() == bb[i].dueDate.month)) {

            // Instantiating all HTML elements

            let assignment = bb[i].assignment;
            let time = bb[i].dueDate;
            let div = cols[bb[i].dueDate.date].getElementsByClassName(".calTaskWrapper")[0];
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
            if (time.hour == 12) {
                if (time.minute != 0) {
                    taskTime.innerHTML = "" + 12 + ":" + time.minute + "PM";
                }
                else {
                    taskTime.innerHTML = "" + 12 + ":" + 00 + "PM";
                }

            }
            if (time.hour < 12) {
                if (time.minute != 0) {
                    taskTime.innerHTML = "" + time.hour + ":" + time.minute + "AM";
                }
                else {
                    taskTime.innerHTML = "" + time.hour + ":" + 00 + "AM";
                }
            }
            else {
                if (time.minute != 0) {
                    taskTime.innerHTML = "" + (time.hour - 12) + ":" + time.minute + "PM";
                }
                else {
                    taskTime.innerHTML = "" + (time.hour - 12) + ":" + 00 + "PM";
                }
            }

            // Appending new elements to calendar div
            taskContent.appendChild(taskTime);
            taskContent.appendChild(taskTitle);
            task.appendChild(taskContent);
            div.appendChild(Task);

        }
    }

    // Gradescope calendar fill
    for (var i = 0; i < gs.length; i++) {

        if (today.getMonth() == gs[i].dueDate.month) {

            // Instantiating all HTML elements

            let assignment = gs[i].assignment;
            let time = gs[i].dueDate;
            let div = cols[gs[i].dueDate.date].getElementsByClassName(".calTaskWrapper")[0];
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
            if (time.hour == 12) {
                taskTime.innerHTML = "" + 12 + time.minute + "PM";
            }
            if (time.hour < 12) {
                taskTime.innerHTML = "" + time.hour + time.minute + "AM";
            }
            else {
                taskTime.innerHTML = "" + (time.hour - 12) + time.minute + "PM";
            }

            // Appending new elements to calendar div
            taskContent.appendChild(taskTime);
            taskContent.appendChild(taskTitle);
            task.appendChild(taskContent);
            div.appendChild(Task);

        }
    }
});
