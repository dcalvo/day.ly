var messageJSON;

async function populateMessages() {
  var messages = document.querySelectorAll(".message");

  var messageStringData = await fetch("http://localhost:3000/api/groupme");
  try {
    messageJSON = await messageStringData.json();
    messages.forEach((message) => {
      message.style.visibility = "visible";
    });
    document.querySelector(".loginButton").style.display = "none";
    // set .message visibility property to visible
  } catch {
    document.querySelector(".loginButton").style.display = "block";
  }
  var messageArray = [];
  console.log(messageJSON);
  for (var i = 0; i < 6; i++) {
    var messageInfo = messageJSON[i];
    var groupName = messageInfo.groupName;
    var senderName = messageInfo.lastMessagePreview.nickname;
    var messageText = messageInfo.lastMessagePreview.text;
    var profPic = messageInfo.lastMessagePreview.image_url;

    messages[i].querySelector(".groupchatTitle").innerHTML = groupName;
    if (profPic == "" || profPic == null) {
      messages[i].querySelector(".prof").src = "img/groupme2.png";
    } else {
      messages[i].querySelector(".prof").src = profPic;
    }
    messages[i].querySelector(".senderName").innerHTML = senderName;
    messages[i].querySelector(".text").innerHTML = messageText;
  }
}

populateMessages();
