var messageJSON;

async function populateMessages(){

  var messages = document.querySelectorAll('.message');

  var messageStringData = await fetch("http://localhost:3000/api/groupme");
  var messageArray = [];
  messageJSON = await messageStringData.json();
  console.log(messageJSON);
  for(var i = 0; i < 5; i++){

    var messageInfo = messageJSON[i];
    var groupName = messageInfo.groupName;
    var senderName = messageInfo.lastMessagePreview.nickname;
    var messageText = messageInfo.lastMessagePreview.text;
    var profPic = messageInfo.lastMessagePreview.image_url;

    messages[i].querySelector('.groupchatTitle').innerHTML = groupName;
    messages[i].querySelector('.prof').src = profPic;
    messages[i].querySelector('.senderName').innerHTML = senderName;
    messages[i].querySelector('.text').innerHTML = messageText;

  }

}

populateMessages();
