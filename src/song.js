const getRandomOccurance = require("./random-occurances");
const randomOccurance = getRandomOccurance();

const PLAYBACK_RATE_DEFAULT = 1;

let gopherSongAudio;

function getGopherSong() {
  if (randomOccurance === "rosco") {
    return "gophers-rosco.mp3";
  }

  
  return "gophers-original.mp3";
}

function setSongPlaybackRate(value) {
  gopherSongAudio.playbackRate = value;
}

function resetSongPlaybackRate() {
  setSongPlaybackRate(PLAYBACK_RATE_DEFAULT);
}

function songReady() {
  gopherSongAudio = new Audio(`songs/${getGopherSong()}`);
  gopherSongAudio.preload = true;
  gopherSongAudio.playbackRate = PLAYBACK_RATE_DEFAULT; // min is 0.5, max 4 really
  gopherSongAudio.preservesPitch = true;
  gopherSongAudio.webkitPreservesPitch = true;
  gopherSongAudio.mozPreservesPitch = true;

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
