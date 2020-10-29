const GOPHER_IMAGE = "gopher.png";
const GOPHER_SONG = "gophersong.mp3";

const GOPHER_POSITIONS = ["top", "right", "bottom", "left"];

const gopherSongAudio = new Audio(GOPHER_SONG);
gopherSongAudio.preload = true;

let canPlayThroughGopherSong = false;
gopherSongAudio.addEventListener("canplaythrough", () => {
  canPlayThroughGopherSong = true;
});

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

function generateGopher({ bigGopher = false } = {}) {
  const gopherImage = bigGopher
    ? new Image(403 / 1.5, 419 / 1.5)
    : new Image(403 / 2, 419 / 2);
  gopherImage.src = GOPHER_IMAGE;

  const duration = bigGopher ? 3 : 2;
  const durationMilliseconds = duration * 1000;
  gopherImage.style.animationDuration = `${duration}s`;

  if (bigGopher) {
    gopherImage.className = `gopher gopher--bottom gopher--big`;
    gopherImage.style.right = "10px";
  } else {
    randomlyPositionGopher(gopherImage);
  }

  gopherImage.addEventListener("load", () => {
    document.body.appendChild(gopherImage);
    setTimeout(() => gopherImage.remove(), durationMilliseconds);
  });
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
    const countdownDuration = 9600;
    setTimeout(() => {
      const gophersInterval = setInterval(() => {
        generateGopher();
        generateGopher();
      }, 1000);

      const songDuration = gopherSongAudio.duration * 1000;
      const hahaDidYouGetMeDuration = 2000;
      const endingTimeout =
        songDuration - countdownDuration - hahaDidYouGetMeDuration;
      setTimeout(() => {
        clearInterval(gophersInterval);
        generateGopher({ bigGopher: true });
      }, endingTimeout);
    }, countdownDuration); // countdown
  });
}

function launchGophers() {
  // if audio has already loaded
  if (canPlayThroughGopherSong) {
    playSongAndStartGophers();
  } else {
    // otherwise wait to the audio is loaded
    gopherSongAudio.addEventListener(
      "canplaythrough",
      playSongAndStartGophers,
      false
    );
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
