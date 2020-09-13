document.getElementById("change").addEventListener('click', toggle);

function toggle(){

  var phrase = document.getElementById("change");
  if(phrase.innerHTML == "month."){

    phrase.innerHTML = "week.";
    document.getElementById("toggleOff").id = "";
    document.querySelector("div.container-fluid").id = "toggleOff";


  }
  else{

    phrase.innerHTML = "month.";
    document.getElementById("toggleOff").id = "";
    document.querySelectorAll("div.container-fluid")[1].id = "toggleOff";

  }

}
