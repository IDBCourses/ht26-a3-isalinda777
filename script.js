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

const shape1 = createShape("greenCircle"); //Setting the shapes as fixed parts of the programme
const shape2 = createShape("pinkCircle");
const shape3 = createShape("purpleCircle");
const shape4 = createShape("yellowCircle");
const speedLight = createShape("speedLight");

// ---------- State ----------
let lastX = 0;
let lastY = 0;
let lastTime = 0;

let speeds = []; // Speeds array, keeps the speeds recorded
// ---------- Sound ----------
const synth = new Tone.Synth().toDestination();

// ---------- Controls (Event Handlers) ----------
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
}
function enterGreen() {
  synth.triggerAttack(notes.greenNote); //Calls the note in the 'notes' object
}

function enterPink() {
  synth.triggerAttack(notes.pinkNote);
}
function enterPurple() {
  synth.triggerAttack(notes.purpleNote);
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
  console.log(speed);
  speeds.push(speed);

  setTimeout(forgetOldest, 500);
  useAverage();
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
  synth.detune.value = average * 200;
  speedLight.setColour(Math.max(240 - average * 60, 0), 90, 55);
}

// ---------- Setup ----------

function setup() {
  shape1.setSize(245);
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
  speedLight.setColour(240, 90, 55); // Speed color circle

  // Event listener code
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
