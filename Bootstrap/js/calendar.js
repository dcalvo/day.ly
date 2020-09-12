var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
console.log(date);
let cols =  document.querySelectorAll(".calCol");

for (var j = 0; j < cols.length; j++) {
    if (cols[j].querySelector("p").innerHTML == ("" + today.getDate())) {
        cols[j].querySelector("p").id = "today";
        console.log(cols[j]);
        break;
    }
}