// global variables:
var pattern = [2, 5, 4, 3, 2, 1, 6, 4]; // tracks pattern of button presses
var progress = 0; // how far alng the player is in guessing the pattern
var gamePlaying = false; // track whether the game is currently active
// gamePlaying will be true once the user presses start and remain until they win/lose/stop

//adding volume:
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0

// var audio1 = new Audio("https://cdn.glitch.global/287cc933-19b8-44bb-81d7-3db9847987f4/Birds-chirping-sound-effect.mp3?v=1647567608005");

//how long to hold each clue's light/sound
const clueHoldTime = 1000; // 1000 millisecond = 1 second
const cluePauseTime = 50; // how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before playing sequence
const limitedTime = 4000; // 4 seconds

//keep track of losses
var guessCounter = 0;

function startGame() {
  // initialize game variables
  progress = 0; // game is at the beginning
  gamePlaying = true;

  // swap the start and stop button:
  // press stop = swap start with stop (hide start, unhide stop)
  document.getElementById("Startbtn").classList.add("hidden");
  document.getElementById("Endbtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("Startbtn").classList.remove("hidden");
  document.getElementById("Endbtn").classList.add("hidden");
}

// for sound:
// Sound Synthesis Functions
const freqMap = {
  1: 349,
  2: 489.6,
  3: 525.1,
  4: 602.4,
  5: 732.7,
  6: 892.1,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);


// lighting functions:
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

// function for playing a single clue:
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

// to check user response:
function loseGame() {
  stopGame();
  alert("Game Over. You lose."); // pop up dialogue box
}

function winGame() {
  stopGame();
  alert("Game Over. You WON!");
}

// handling guesses:
function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  // add game logic here
  // if not active, break out of the function:
  if (!gamePlaying) {
    return;
  }

  // if the guess was correct:
  if (pattern[guessCounter] == btn) {
    // it should be correct:
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  }
  // if the guess was not correct then you'd lose:
  else {
    loseGame();
  }

}

