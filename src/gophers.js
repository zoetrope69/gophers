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
