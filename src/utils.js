function hasSearchParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams) {
    return false;
  }
  return searchParams.has(param);
}

function getSearchParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams) {
    return "";
  }
  return searchParams.get(param);
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
  getSearchParam,
  shuffleArray,
};
