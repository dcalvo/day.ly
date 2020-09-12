const fetch = require("node-fetch");

async function getGroupmeMessages(token) {
  const response = await fetch(
    `https://api.groupme.com/v3/groups?token=${token}`
  );
  const json = await response.json();
  const groupName = json.response[0].name;
  const groupImg = json.response[0].image_url;
  const lastMessagePreview = json.response[0].messages.preview;
  const result = { groupName, groupImg, lastMessagePreview };
  console.log(result);
  return result;
}

exports.getGroupmeMessages = getGroupmeMessages;
