const { hasSearchParam } = require("./utils");
const { generateGopher, generateEndingGopher } = require("./gophers");
const {
  songReady,
  playSong,
  getSongDuration,
  createDurationSeconds,
  resetSongPlaybackRate,
  setSongPlaybackRate,
} = require("./song");
const getRandomOccurance = require("./random-occurances");
const initTwitchChat = require("./twitch-chat");

const twitchChat = initTwitchChat();

async function launchGophers() {
  const randomOccurance = getRandomOccurance();

  await songReady();

  if (randomOccurance === "fast") {
    setSongPlaybackRate(2);
  }

  let gopherEndingRoscoAudio;
  if (randomOccurance === "rosco") {
    gopherEndingRoscoAudio = new Audio("songs/end-rosco.mp3");
    gopherEndingRoscoAudio.preload = true;
  }

  // delete after xmas
  jingleBellsAudio = new Audio("songs/jingle-bells.mp3");
  jingleBellsAudio.preload = true;
  jingleBellsAudio.loop = true;
  jingleBellsAudio.play();
  hoHoHoMerryChristmasAudio = new Audio("songs/ho-ho-ho-merry-christmas.mp3");
  hoHoHoMerryChristmasAudio.preload = true;
  hoHoHoMerryChristmasAudio.loop = true;
  hoHoHoMerryChristmasAudio.play();
  happyChristmasAudio = new Audio("songs/happy-christmas.mp3");
  happyChristmasAudio.preload = true;
  happyChristmasAudio.loop = true;
  happyChristmasAudio.play();
  xmasEndingAudio = new Audio("songs/merry-xmas-ending.mp3");
  xmasEndingAudio.preload = true;
 

  await playSong();

  function afterCountdown() {
    const gophersIntervals = [
      setInterval(generateGopher, createDurationSeconds(1)),
      setInterval(generateGopher, createDurationSeconds(1.5)),
    ];

    if (randomOccurance === "fast") {
      // more gophers
      gophersIntervals.push(
        setInterval(generateGopher, createDurationSeconds(1.25))
      );
      gophersIntervals.push(
        setInterval(generateGopher, createDurationSeconds(1.75))
      );
    }

    function justBeforeTheEndOfTheSong() {
      resetSongPlaybackRate();
      gophersIntervals.forEach(clearInterval);
      generateEndingGopher();

      // delete after xmas
      jingleBellsAudio.pause();
      hoHoHoMerryChristmasAudio.pause();
      happyChristmasAudio.pause();
      xmasEndingAudio.play();

      if (gopherEndingRoscoAudio) {
        gopherEndingRoscoAudio.play();
      }

      if (twitchChat) {
        if (randomOccurance === "rosco") {
          twitchChat.sendMessage(
            "Rosco illustration by Pei Yen: https://twitter.com/_peiyen/status/1322384780239888384"
          );
        }
      }
    }

    const songDuration = createDurationSeconds(getSongDuration());
    const hahaDidYouGetMeDuration = createDurationSeconds(2);
    const endingTimeout =
      songDuration - countdownDuration - hahaDidYouGetMeDuration;
    setTimeout(justBeforeTheEndOfTheSong, endingTimeout);
  }

  const countdownDuration = createDurationSeconds(9.6);
  setTimeout(afterCountdown, countdownDuration);
}

function debugPlayButton(callback) {
  /*
  in browsers it often complains at autoplay, so for debug we add a
  ?showPlayButton to the end of the URL to allow us to start it with
  a button
*/
  if (hasSearchParam("showPlayButton")) {
    const buttonElem = document.createElement("button");
    buttonElem.innerText = "Play Gophers";
    buttonElem.addEventListener("click", () => {
      callback();
      buttonElem.remove();
    });
    document.body.append(buttonElem);
  } else {
    callback();
  }
}

debugPlayButton(launchGophers);
