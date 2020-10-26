const GOPHER_IMAGE =
  "https://cdn.glitch.com/a3c0d2a1-79fe-4ed8-8b4a-99cf0cc5de3a%2Fgopher.png?v=1603729753153";
const GOPHER_SONG =
  "https://cdn.glitch.com/a3c0d2a1-79fe-4ed8-8b4a-99cf0cc5de3a%2Fgophersong.mp3?v=1603738144988";

const GOPHER_POSITIONS = ["top", "right", "bottom", "left"];

const gopherSongAudio = new Audio(GOPHER_SONG);
gopherSongAudio.preload = true;

let canPlayThroughGopherSong = false;
gopherSongAudio.addEventListener("canplaythrough", () => {
  canPlayThroughGopherSong = true;
});

function generateGopher({ bigGopher = false } = {}) {
  const image = bigGopher
    ? new Image(403 / 1.5, 419 / 1.5)
    : new Image(403 / 2, 419 / 2);
  image.src = GOPHER_IMAGE;

  const duration = bigGopher ? 3 : 2;
  const durationMilliseconds = duration * 1000;
  image.style.animationDuration = `${duration}s`;

  if (bigGopher) {
    image.className = `gopher gopher--bottom gopher--big`;
    image.style.right = "10px";
  } else {
    const randomPosition =
      GOPHER_POSITIONS[Math.floor(Math.random() * GOPHER_POSITIONS.length)];
    image.className = `gopher gopher--${randomPosition}`;

    const randomPercentage = Math.round(Math.floor(Math.random() * 5)) * 20;
    if (randomPosition === "top" || randomPosition === "bottom") {
      image.style.left = `${randomPercentage}%`;
    } else if (randomPosition === "right" || randomPosition === "left") {
      image.style.top = `${randomPercentage}%`;
    }
  }

  image.addEventListener("load", () => {
    document.body.appendChild(image);
    setTimeout(() => image.remove(), durationMilliseconds);
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
    const countdownDuration = 10400;
    setTimeout(() => {
      const gophersInterval = setInterval(() => {
        generateGopher();
        generateGopher();
      }, 1000);

      const songDuration = gopherSongAudio.duration * 1000;
      const hahaDidYouGetMeDuration = 2000;
      const endingTimeout = songDuration - countdownDuration - hahaDidYouGetMeDuration
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

launchGophers();
