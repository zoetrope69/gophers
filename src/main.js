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
const getRandomOccurance = require("./randomOccurances");

async function launchGophers() {
  const randomOccurance = getRandomOccurance();

  if (randomOccurance === "fast") {
    setSongPlaybackRate(2);
  }

  await songReady();
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
