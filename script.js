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
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.

const notes = {
  greenNote: "A4",
  pinkNote: "D4",
  purpleNote: "C4",
  yellowNote: "G4",
};

const shape1 = createShape("greenCircle"); //should this be here or in setup?
const shape2 = createShape("pinkCircle");
const shape3 = createShape("purpleCircle");
const shape4 = createShape("yellowCircle");

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
let playing = false;
let lastX = 0;
let lastY = 0;
let lastTime = 0;

let speeds = [];
// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.Synth().toDestination();
// ---------- Update ----------
// Update the state. This is called every 100ms.
//function update() {
//setTimeout(update, 100); // call update() again in 100 milliseconds
//}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
//function use() {
//setTimeout(use, 100); // call use() again in 100 milliseconds
//}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  console.log("Pointer down at", event.clientX, event.clientY);
}
function enterGreen() {
  synth.triggerAttack(notes.greenNote);
  console.log(" Enter green ");
}

function enterPink() {
  synth.triggerAttack(notes.pinkNote);
  console.log(" Enter pink ");
}
function enterPurple() {
  synth.triggerAttack(notes.purpleNote);
  console.log(" Enter purple ");
}
function enterYellow() {
  synth.triggerAttack(notes.yellowNote);
}
function pointerLeave() {
  synth.triggerRelease();
}

function pointerMove(event) {
  let normX = event.clientX / window.innerWidth;
  let normY = event.clientY / window.innerHeight;
  let now = Date.now();
  let distance = Math.hypot(normX - lastX, normY - lastY); // in screens
  let seconds = (now - lastTime) / 1000;
  if (seconds === 0) {
    return;
  }
  let speed = distance / seconds; // screens per second
  lastX = normX;
  lastY = normY;
  lastTime = now;
  console.log(speed + " speed!");

  speeds.push(speed);
  console.log(speeds.length);

  setTimeout(forgetOldest, 500);
  useAverage();

  //if (speeds.length > 10) {
  //speeds.shift();
}

function forgetOldest() {
  speeds.shift();
  useAverage();
}

function useAverage() {
  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total = total + speeds[i];
  }
  let average = 0;
  if (speeds.length > 0) {
    average = total / speeds.length;
  }
  synth.detune.value = average * 300;
  console.log(average + " average ");
}

//}
// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  //update(); // start the update loop
  //use(); // start the use loop

  shape1.setSize(245);
  shape1.setColour(111, 30, 30);
  shape1.setPosition(0.5, 0.8); //green circle

  shape2.setSize(245);
  shape2.setColour(333, 80, 45);
  shape2.setPosition(0.8, 0.2); //pink circle

  shape3.setSize(250);
  shape3.setColour(270, 60, 30);
  shape3.setPosition(0.15, 0.4); // purple circle

  shape4.setSize(250);
  shape4.setColour(50, 90, 60);
  shape4.setPosition(0.3, 0.7); // yellow circle

  // Put your event listener code here
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

setup(); // Always remember to call setup()!
