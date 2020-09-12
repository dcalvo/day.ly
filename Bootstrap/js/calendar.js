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

document.getElementById("refresh").addEventListener("click", function() {
    if (result.href_en != null) {
        let oldDiv = document.getElementsByClassName("msgF")[0];
        let a = document.createElement('a');
        var linkText;
        linkText = document.createTextNode("English");
        a.appendChild(linkText);
        a.title = "en_Link";
        a.href = `${result.href_en}`;
        oldDiv.appendChild(a);
    }
  });
