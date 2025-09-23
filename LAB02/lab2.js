// lab2.js
// LAB02 - Rock-Paper-Scissors Console App

console.log("LAB02 started");

const prompt = require('prompt'); // Load prompt package 

// Function to get computer choice
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

// Function to decide winner
function decideWinner(user, comp) {
  if (user === comp) {
    return "It's a tie";
  } else if (
    (user === 'ROCK' && comp === 'SCISSORS') ||
    (user === 'PAPER' && comp === 'ROCK') ||
    (user === 'SCISSORS' && comp === 'PAPER')
  ) {
    return "User Wins";
  } else {
    return "Computer Wins";
  }
}

// Start prompt
prompt.start();

// Ask the user for input
prompt.get(['userSelection'], function (err, result) {
  if (err) {
    console.log("Error:", err);
    return;
  }

  let user = result.userSelection.trim().toUpperCase();
  if (user === 'R') user = 'ROCK';
  if (user === 'P') user = 'PAPER';
  if (user === 'S') user = 'SCISSORS';

  console.log("User selection:", user);

  const comp = computerPick();
  console.log("Computer selection:", comp);
  console.log(decideWinner(user, comp));
});
