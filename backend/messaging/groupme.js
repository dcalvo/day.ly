const fetch = require("node-fetch");
fetch("https://api.groupme.com/v3/chats?token=cc2a2d00d7750138126116e3b19c9748")
  .then((res) => res.json())
  .then((json) => console.log());
