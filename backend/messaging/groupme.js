const fetch = require("node-fetch");

async function getGroupmeMessages(token) {
  const response = await fetch(
    `https://api.groupme.com/v3/groups?token=${token}&omit=memberships`
  );
  //   const json = await response.json();
  //   const groupsCount = 5;
  //   for (let i = 0; i < groupsCount; i++) {
  //     const groupName = json.response[i].name;
  //     const groupImg = json.response[i].image_url;
  //     const lastMessagePreview = json.response[i].messages.preview;
  //     const result = { groupName, groupImg, lastMessagePreview };
  //   }
  //   console.log(result);
  //   return result;
}

exports.getGroupmeMessages = getGroupmeMessages;
