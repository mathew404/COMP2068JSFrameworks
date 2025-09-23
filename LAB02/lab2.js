// lab2.js
console.log("LAB02 started");

function computerPick() {
  const r = Math.random();
  if (r < 0.35) {
    return 'PAPER';
  } else if (r < 0.68) {
    return 'SCISSORS';
  } else {
    return 'ROCK';
  }
}

const comp = computerPick();
console.log("Computer selection:", comp);
