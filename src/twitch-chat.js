require("./lib/tmi-1.5.0.min.js"); // creates tmi global
const { getSearchParam } = require("./utils");

function initTwitchChat() {
  const oAuthSearchParam = getSearchParam("oAuth");
  const channelSearchParam = getSearchParam("channel");

  if (!oAuthSearchParam || !channelSearchParam) {
    return null;
  }

  console.log("oAuthSearchParam", oAuthSearchParam);
  console.log("channelSearchParam", channelSearchParam);

  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: "TheMostBeautifulDog",
      password: `oauth:${oAuthSearchParam}`,
    },
    channels: [channelSearchParam],
  });

  client.connect();

  client.sendMessage = (message) => {
    client.say(channelSearchParam, message);
  };

  return client;
}

module.exports = initTwitchChat;
