var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
console.log(date);
let cols = document.querySelectorAll(".calCol");

for (var j = 0; j < cols.length; j++) {
    if (cols[j].querySelector("p").innerHTML == ("" + today.getDate())) {
        cols[j].querySelector("p").id = "today";
        console.log(cols[j]);
        break;
    }
}

document.getElementById("refresh").addEventListener("click", async function () {

    // begin loading here; perhaps grey out or just have cool loading thing from NATo project

    let bbRequest = await fetch("http://localhost:3000/api/blackboard");
    let gsRequest = await fetch("http://localhost:3000/api/gradescope");
    let gmRequest = await fetch("http://localhost:3000/api/groupme");

    bb = JSON.parse(bbRequest);
    gs = JSON.parse(gsRequest);
    gm = JSON.parse(gmRequest);
    
    // Blackboard calendar fill
    for (var i = 0; i < bb.length; i++) {
        if(today.getMonth() == bb[i].dueDate.month) {
            let div = cols[i];
            let task = document.createElement("calTaskCard");
        }
    }


    // adding new divs to calendars
    let oldDiv = document.getElementsByClassName("msgF")[0];
    let a = document.createElement('a');
    var linkText;
    linkText = document.createTextNode("English");
    a.appendChild(linkText);
    a.title = "en_Link";
    a.href = `${result.href_en}`;
    oldDiv.appendChild(a);

});
