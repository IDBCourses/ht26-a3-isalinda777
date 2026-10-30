/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------

const notes = {
  // One place for all the notes, in case they're changed (Object, each note is a property)
  greenNote: "C3",
  pinkNote: "G3",
  purpleNote: "D4",
  yellowNote: "A4",
};

const shape1 = createShape("greenCircle"); //Created here so every function can use them
const shape2 = createShape("pinkCircle");
const shape3 = createShape("purpleCircle");
const shape4 = createShape("yellowCircle");
const speedLight = createShape("speedLight");

// ---------- State ----------
let lastX = 0; // Comment
let lastY = 0; // Comment
let lastTime = 0; // Comment

let speeds = []; // Speeds array, keeps the speeds recorded
// ---------- Sound ----------
const synth = new Tone.Synth().toDestination(); // Comment

// ---------- Controls (Event Handlers) ----------
function pointerDown(event) {
  //Runs when it's clicked: Activates the browser to play the sound
  Tone.start(); // browsers only allow sound after the player has pressed something
}
function enterGreen() {
  //Runs when the pointer enters the green circle (in setup): It plays its respective note
  synth.triggerAttack(notes.greenNote); //Calls the note in the 'notes' object
}

function enterPink() {
  //Runs when the pointer enters the pink circle (in setup): It plays its respective note
  synth.triggerAttack(notes.pinkNote);
}
function enterPurple() {
  //Runs when the pointer enters the purple circle (in setup): It plays its respective note
  synth.triggerAttack(notes.purpleNote);
}
function enterYellow() {
  //Runs when the pointer enters the yellow circle (in setup): It plays its respective note
  synth.triggerAttack(notes.yellowNote);
}
function pointerLeave() {
  // Runs when the pointer leaves any of the circles (in setup): Releases the note so that it doesn't play outside of the circles
  synth.triggerRelease();
}

function pointerMove(event) {
  // Runs every time the pointer moves: Calculates how fast it is moving and remembers the speed
  let normX = event.clientX / window.innerWidth; // The position as a fraction of the screen, so that it is the same on every size screen
  let normY = event.clientY / window.innerHeight;
  let now = Date.now();
  let distance = Math.hypot(normX - lastX, normY - lastY); // straight-line distance since the last move (Pythagoras)
  let seconds = (now - lastTime) / 1000; // time since the last move, from milliseconds to seconds
  if (seconds === 0) {
    // Comment
    return;
  }
  let speed = distance / seconds; // screens per second
  lastX = normX; // Comment
  lastY = normY; // Comment
  lastTime = now;
  speeds.push(speed); // Add the newest speed into the array

  setTimeout(forgetOldest, 500); // Forget the speeds recorded more than half a second ago
  useAverage();
}

function forgetOldest() {
  // Runs every half a second in pointerMove: takes out the speeds from the array
  speeds.shift();
  useAverage();
}

function useAverage() {
  //Runs when the pointer moves, as the speeds are being recorded: Makes the average of the speeds in the speeds array
  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total = total + speeds[i];
  }
  let average = 0;
  if (speeds.length > 0) {
    // Comment
    average = total / speeds.length;
  }
  synth.detune.value = average * 200; // Sets the pitch based on the average of speeds
  speedLight.setColour(Math.max(240 - average * 60, 0), 90, 55); // Changes the small circle's color based on the speed, is here due to 'average' 's scope
}

// ---------- Setup ----------

function setup() {
  // Setup is run once, at the start of the program. It sets everything up

  shape1.setSize(245); //Gives each circle its size, colour and position
  shape1.setColour(111, 30, 70);
  shape1.setPosition(0.2, 0.6); //green circle

  shape2.setSize(245);
  shape2.setColour(333, 80, 45);
  shape2.setPosition(0.6, 0.1); //pink circle

  shape3.setSize(245);
  shape3.setColour(270, 60, 30);
  shape3.setPosition(0.2, 0.1); // purple circle

  shape4.setSize(245);
  shape4.setColour(50, 90, 60);
  shape4.setPosition(0.6, 0.6); // yellow circle

  speedLight.setSize(80);
  speedLight.setPosition(0.5, 0.5);
  speedLight.setColour(240, 90, 55); // Starting colour for the speed colour circle

  // Event listener code //Comment
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
  shape1.element.addEventListener("pointerenter", enterGreen);
  shape1.element.addEventListener("pointerleave", pointerLeave);

  shape2.element.addEventListener("pointerenter", enterPink);
  shape2.element.addEventListener("pointerleave", pointerLeave);

  shape3.element.addEventListener("pointerenter", enterPurple);
  shape3.element.addEventListener("pointerleave", pointerLeave);

  shape4.element.addEventListener("pointerenter", enterYellow);
  shape4.element.addEventListener("pointerleave", pointerLeave);
}

setup();
