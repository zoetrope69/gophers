const RANDOM_OCCURANCES = [{ type: "fast", chancePercentage: 0 }];

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

function getRandomOccurance() {
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

const randomOccurance = getRandomOccurance();
console.log("random occurance:", randomOccurance || "none");

const GOPHER_IMAGE = "images/gopher-original.png";
const GOPHER_IMAGE_WIDTH = 403;
const GOPHER_IMAGE_HEIGHT = 419;

const GOPHER_SONG = "songs/gopher-original.mp3";

const GOPHER_POSITIONS = ["top", "right", "bottom", "left"];

// min is 0.5, max 4 really
const PLAYBACK_RATE_DEFAULT = 1;
function getPlaybackRate() {
  if (randomOccurance === "fast") {
    return 2;
  }

  return PLAYBACK_RATE_DEFAULT;
}
const playbackRate = getPlaybackRate();

const gopherSongAudio = new Audio(GOPHER_SONG);
gopherSongAudio.preload = true;
gopherSongAudio.playbackRate = playbackRate;
gopherSongAudio.preservesPitch = true;
gopherSongAudio.webkitPreservesPitch = true;
gopherSongAudio.mozPreservesPitch = true;

let canPlayThroughGopherSong = false;
gopherSongAudio.addEventListener("canplaythrough", () => {
  canPlayThroughGopherSong = true;
});

function createDurationSeconds(seconds) {
  return (seconds * 1000) / playbackRate;
}

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
  const gopherImage = new Image(
    GOPHER_IMAGE_WIDTH / 1.5,
    GOPHER_IMAGE_HEIGHT / 1.5
  );
  gopherImage.src = GOPHER_IMAGE;

  const durationMilliseconds = createDurationSeconds(3);

  gopherImage.style.animationDuration = `${durationMilliseconds}ms`;
  gopherImage.className = `gopher gopher--bottom gopher--big`;
  gopherImage.style.right = "10px";

  addGopherToPage(gopherImage, durationMilliseconds);
}

function generateGopher() {
  const gopherImage = new Image(
    GOPHER_IMAGE_WIDTH / 2,
    GOPHER_IMAGE_HEIGHT / 2
  );
  gopherImage.src = GOPHER_IMAGE;

  const durationMilliseconds = createDurationSeconds(2);

  gopherImage.style.animationDuration = `${durationMilliseconds}ms`;

  randomlyPositionGopher(gopherImage);
  addGopherToPage(gopherImage, durationMilliseconds);
}

function playSongAndStartGophers() {
  gopherSongAudio.play();

  /*
    this is a bit like spaghetti so here's whats happening
    1. when the audio plays
    2. wait 10 seconds while the countdown is happening
    3. start generating 2 gophers every 2 seconds
    4. wait until we get towards the end of the song
    5. stop generating gophers and generate a big gopher
  */
  gopherSongAudio.addEventListener("play", () => {
    function afterCountdown() {
      const gophersIntervals = [
        setInterval(generateGopher, createDurationSeconds(1)),
        setInterval(generateGopher, createDurationSeconds(1.5)),
      ];

      function justBeforeTheEndOfTheSong() {
        gophersIntervals.forEach(clearInterval);
        generateEndingGopher();
      }

      const songDuration = createDurationSeconds(gopherSongAudio.duration);
      const hahaDidYouGetMeDuration = createDurationSeconds(2);
      const endingTimeout =
        songDuration - countdownDuration - hahaDidYouGetMeDuration;
      setTimeout(justBeforeTheEndOfTheSong, endingTimeout);
    }

    const countdownDuration = createDurationSeconds(9.6);
    setTimeout(afterCountdown, countdownDuration);
  });
}

function launchGophers() {
  // if audio has already loaded
  if (canPlayThroughGopherSong) {
    playSongAndStartGophers();
  } else {
    // otherwise wait to the audio is loaded
    gopherSongAudio.addEventListener("canplaythrough", playSongAndStartGophers);
  }
}

/*
  in browsers it often complains at autoplay, so for debug we add a
  ?showPlayButton to the end of the URL to allow us to start it with
  a button
*/
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has("showPlayButton")) {
  const buttonElem = document.createElement("button");
  buttonElem.innerText = "Play Gophers";
  buttonElem.addEventListener("click", () => {
    launchGophers();
    buttonElem.remove();
  });
  document.body.append(buttonElem);
} else {
  launchGophers();
}
