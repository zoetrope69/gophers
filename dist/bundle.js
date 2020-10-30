(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { createDurationSeconds } = require("./song");

const GOPHER_IMAGE = "images/gopher-original.png";
const GOPHER_IMAGE_WIDTH = 403;
const GOPHER_IMAGE_HEIGHT = 419;

const GOPHER_POSITIONS = ["top", "right", "bottom", "left"];

function randomlyPositionGopher(gopherImage) {
  const randomPosition =
    GOPHER_POSITIONS[Math.floor(Math.random() * GOPHER_POSITIONS.length)];
  gopherImage.className = `gopher gopher--${randomPosition}`;

  const randomPercentage = Math.round(Math.floor(Math.random() * 5)) * 20;
  if (randomPosition === "top" || randomPosition === "bottom") {
    gopherImage.style.left = `${randomPercentage}%`;
  } else if (randomPosition === "right" || randomPosition === "left") {
    gopherImage.style.top = `${randomPercentage}%`;
  }
}

function addGopherToPage(gopherImage, timeout) {
  gopherImage.addEventListener("load", () => {
    document.body.appendChild(gopherImage);
    setTimeout(() => gopherImage.remove(), timeout);
  });
}

function generateEndingGopher() {
  const gopherImage = new Image(GOPHER_IMAGE_WIDTH, GOPHER_IMAGE_HEIGHT);
  gopherImage.src = GOPHER_IMAGE;

  const durationMilliseconds = createDurationSeconds(3.5);

  gopherImage.style.animationDuration = `${durationMilliseconds}ms`;
  gopherImage.className = `gopher gopher--bottom gopher--big`;
  gopherImage.style.right = "15px";

  addGopherToPage(gopherImage, durationMilliseconds);
}

function generateGopher() {
  const gopherImage = new Image(
    GOPHER_IMAGE_WIDTH / 2,
    GOPHER_IMAGE_HEIGHT / 2
  );
  gopherImage.src = GOPHER_IMAGE;

  const durationMilliseconds = createDurationSeconds(1.5);

  gopherImage.style.animationDuration = `${durationMilliseconds}ms`;

  randomlyPositionGopher(gopherImage);
  addGopherToPage(gopherImage, durationMilliseconds);
}

module.exports = {
  generateGopher,
  generateEndingGopher,
};

},{"./song":4}],2:[function(require,module,exports){
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

},{"./gophers":1,"./randomOccurances":3,"./song":4,"./utils":5}],3:[function(require,module,exports){
const { hasSearchParam, shuffleArray } = require("./utils");

const RANDOM_OCCURANCES = [{ type: "fast", chancePercentage: 100 }];

function generateRandomOccurance() {
  // if we want the random occurances to stop add ?disableOccurances=true
  if (hasSearchParam("disableOccurances")) {
    return;
  }

  const shuffledRandomOccurances = shuffleArray(RANDOM_OCCURANCES);

  const occurance = shuffledRandomOccurances.find((occurance) => {
    const randomNumberBetween0And100 = Math.floor(Math.random() * 100);
    return randomNumberBetween0And100 <= occurance.chancePercentage;
  });

  if (!occurance) {
    return;
  }

  return occurance.type;
}

const randomOccurance = generateRandomOccurance();
console.log("Random occurance:", window.randomOccurance || "none");

function getRandomOccurance() {
  return randomOccurance;
}

module.exports = getRandomOccurance;

},{"./utils":5}],4:[function(require,module,exports){
const GOPHER_SONG = "songs/gopher-original.mp3";

const PLAYBACK_RATE_DEFAULT = 1;

const gopherSongAudio = new Audio(GOPHER_SONG);
gopherSongAudio.preload = true;
gopherSongAudio.playbackRate = PLAYBACK_RATE_DEFAULT; // min is 0.5, max 4 really
gopherSongAudio.preservesPitch = true;
gopherSongAudio.webkitPreservesPitch = true;
gopherSongAudio.mozPreservesPitch = true;

let canPlayThroughGopherSong = false;
gopherSongAudio.addEventListener("canplaythrough", () => {
  canPlayThroughGopherSong = true;
});

function setSongPlaybackRate(value) {
  gopherSongAudio.playbackRate = value;
}

function resetSongPlaybackRate() {
  setSongPlaybackRate(PLAYBACK_RATE_DEFAULT);
}

function songReady() {
  if (canPlayThroughGopherSong) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    gopherSongAudio.addEventListener("canplaythrough", resolve);
  });
}

function playSong() {
  return new Promise((resolve) => {
    gopherSongAudio.play();
    gopherSongAudio.addEventListener("play", resolve);
  });
}

function getSongDuration() {
  return gopherSongAudio.duration;
}

function createDurationSeconds(seconds) {
  return (seconds * 1000) / gopherSongAudio.playbackRate;
}

module.exports = {
  resetSongPlaybackRate,
  setSongPlaybackRate,
  songReady,
  playSong,
  getSongDuration,
  createDurationSeconds,
};

},{}],5:[function(require,module,exports){
function hasSearchParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams) {
    return false;
  }
  return searchParams.has(param);
}

function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = {
  hasSearchParam,
  shuffleArray,
};

},{}]},{},[2]);
