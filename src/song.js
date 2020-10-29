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
