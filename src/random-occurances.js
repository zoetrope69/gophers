const { hasSearchParam, shuffleArray } = require("./utils");

const RANDOM_OCCURANCES = [
  { type: "fast", chancePercentage: 5 },
  { type: "rosco", chancePercentage: 5 },
];

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
console.log("Random occurance:", randomOccurance || "none");

function getRandomOccurance() {
  return randomOccurance;
}

module.exports = getRandomOccurance;
