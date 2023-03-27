// Bakeoff #2 -- Seleção em Interfaces Densas
// IPM 2022-23, Período 3
// Entrega: até dia 31 de Março às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 10 de Abril

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 11; // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE = false; // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS = 12; // The numbers of trials (i.e., target selections) to be completed
const GRID_ROWS = 5; // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS = 6; // We divide our 80 targets in a 8x10 grid
let continue_button;
let legendas; // The item list from the "legendas" CSV

// Metrics
let testStartTime, testEndTime; // time between the start and end of one attempt (8 trials)
let hits = 0; // number of successful selections
let misses = 0; // number of missed selections (used to calculate accuracy)
let database; // Firebase DB

// Study control parameters
let draw_targets = false; // used to control what to show in draw() -> targets
let draw_button = false; //used to controll what to show in draw() -> button
let trials; // contains the order of targets that activate in the test
let current_trial = 0; // the current trial number (indexes into trials array above)
let attempt = 0; // users complete each test twice to account for practice (attemps 0 and 1)

// Target list
let targets = [];

// ButtonCat list
let button;

let backButtons = [];

const orderedIdByName = [
  38, //0% Milk
  53, //0% Yoghurt

  20, //Anjou
  28, //Apple Juice
  58, //Asparagus
  59, //Aubergine
  5, //Avocado

  6, //Banana
  76, //Beef Tomato
  68, //Bell Pepper
  45, //Bio Cream
  37, //Bio Fat Milk
  42, //Bio Milk
  41, //Bio Skim Milk
  50, //Bio Soy Milk
  48, //Bio Soyghurt

  60, //Cabbage
  11, //Cantaloupe
  61, //Carrots
  34, //Cherry Juice
  52, //Cherry Yoghurt
  21, //Conference
  62, //Cucumber

  39, //Fat Milk
  33, //Fresh Juice

  12, //Galia Melon
  63, //Garlic
  64, //Ginger
  0, //Golden
  1, //Granny Smith

  22, //Kaiser
  7, //Kiwi

  65, //Leek
  8, //Lemon
  9, //Lime

  36, //Mandarin Juice
  10, //Mango
  31, //Mango Juice
  55, //Mango Yoghurt
  13, //Melon
  71, //Mild Pepper
  66, //Mushroom

  15, //Nectarine

  44, //Oat Milk
  43, //Oatghurt
  16, //Orange
  29, //Orange Juice

  17, //Papaya
  18, //Passion Fruit
  19, //Peach
  32, //Peach Juice
  30, //Pear Juice
  56, //Pear Yoghurt
  23, //Pineapple
  2, //Pink Lady
  70, //Piri Piri
  24, //Plum
  25, //Pomegranate

  75, //Red Beet
  3, //Red Delicious
  26, //Red Grapefruit
  73, //Red Potato
  69, //Rocoto Pepper
  4, //Royal Gala

  27, //Satsumas
  35, //Smoothie
  46, //Sour Cream
  47, //Sour Milk
  51, //Soy Milk
  49, //Soyghurt
  40, //Standard Milk
  74, //Sweet Potato

  77, //Tomato

  57, //Vanilla Yoghurt
  78, //Vine Tomato

  14, //Watermelon
  72, //White Potato

  67, //Yellow Onion
  54, //Yoghurt

  79, //Zucchini
];

const cat5List = [
  38, //0% Milk
  53, //0% Yoghurt

  20, //Anjou
  28, //Apple Juice
  58, //Asparagus
  59, //Aubergine
  5, //Avocado

  6, //Banana
  76, //Beef Tomato
  68, //Bell Pepper
  45, //Bio Cream
  37, //Bio Fat Milk
  42, //Bio Milk
  41, //Bio Skim Milk
  50, //Bio Soy Milk
  48 //Bio Soyghurt
]

const cat6List = [
  60, //Cabbage
  11, //Cantaloupe
  61, //Carrots
  34, //Cherry Juice
  52, //Cherry Yoghurt
  21, //Conference
  62, //Cucumber
  
  39, //Fat Milk
  33, //Fresh Juice

  12, //Galia Melon
  63, //Garlic
  64, //Ginger
  0, //Golden
  1, //Granny Smith

  22, //Kaiser
  7 //Kiwi
]

const cat1List =[
  65, //Leek
  8, //Lemon
  9, //Lime

  36, //Mandarin Juice
  10, //Mango
  31, //Mango Juice
  55, //Mango Yoghurt
  13, //Melon
  71, //Mild Pepper
  66, //Mushroom

  15, //Nectarine

  44, //Oat Milk
  43, //Oatghurt
  16, //Orange
  29 //Orange Juice
]

const cat2List =[
  17, //Papaya
  18, //Passion Fruit
  19, //Peach
  32, //Peach Juice
  30, //Pear Juice
  56, //Pear Yoghurt
  23, //Pineapple
  2, //Pink Lady
  70, //Piri Piri
  24, //Plum
  25, //Pomegranate

  75, //Red Beet
  3, //Red Delicious
  26, //Red Grapefruit
  73, //Red Potato
  69, //Rocoto Pepper
  4 //Royal Gala
]

const cat3List = [
  27, //Satsumas
  35, //Smoothie
  46, //Sour Cream
  47, //Sour Milk
  51, //Soy Milk
  49, //Soyghurt
  40, //Standard Milk
  74, //Sweet Potato

  77, //Tomato

  57, //Vanilla Yoghurt
  78, //Vine Tomato
]

const cat4List = [
  57, //Vanilla Yoghurt
  78, //Vine Tomato

  14, //Watermelon
  72, //White Potato

  67, //Yellow Onion
  54, //Yoghurt

  79, //Zucchini
]

// Ensures important data is loaded before the program starts
function preload() {
  legendas = loadTable("legendas.csv", "csv", "header");
}
function buttonSetup(horizontal_gap, vertical_gap, targetSize) {
  let labels = ["L, M, N, O", "P, R", "S, T, V", "W, Y, Z", "0, A, B","C, F, G, K"];
  let categoryColors = [
    '#FF4136', // red
    '#FFDC00', // yellow
    '#2ECC40', // green
    '#0074D9', // blue
    '#B10DC9', // purple
    '#FF851B', // orange
  ];
  button = new ButtonCat(width/2, height/2, 6 * PPCM, 3 * PPCM,labels, categoryColors, [cat1List, cat2List, cat3List, cat4List, cat5List, cat6List]);
  createTargets(targetSize);
  let tempTargets = button.getTargets();
  for (let i = 0; i < tempTargets.length; i++) {
    giveTargetsPosition(targetSize,horizontal_gap,vertical_gap,tempTargets[i]);
  }

  backSize = 2 * PPCM;
  let posList = [[0,0], [width - backSize, 0], [width - backSize, height - backSize], [0, height - backSize]];
  for (var i = 0; i < 4; i++){
    let newBack = new ButtonBack(posList[i][0], posList[i][1], backSize, backSize);
    backButtons.push(newBack);
  }

  draw_button = true;
}

// Runs once at the start
function setup() {
  createCanvas(700, 500); // window size in px before we go into fullScreen()
  frameRate(60); // frame rate (DO NOT CHANGE!)

  randomizeTrials(); // randomize the trial order at the start of execution
  drawUserIDScreen(); // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw() {
  if (draw_targets && attempt < 2) {
    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0)); // sets background to black

    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255, 255, 255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    // Draw all targets
    for (var i = 0; i < legendas.getRowCount(); i++) {
      if (targets[i].isDrawn()) {
        targets[i].draw();
      }
    }

    for (var i = 0; i < backButtons.length; i++){
      backButtons[i].draw();
    }

    // Draw the target label to be selected in the current trial
    textFont("Arial", 20);
    textAlign(CENTER);
    text(legendas.getString(trials[current_trial], 0), width / 2, height - 20);
  } 
  else if (draw_button){

    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0)); // sets background to black

    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255, 255, 255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    button.draw();
    
    // Draw the target label to be selected in the current trial
    textFont("Arial", 20);
    fill(color(255, 255, 255));
    textAlign(CENTER);
    text(legendas.getString(trials[current_trial], 0), width / 2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance() {
  // DO NOT CHANGE THESE!
  let accuracy = parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time = (testEndTime - testStartTime) / 1000;
  let time_per_target = nf(test_time / parseFloat(hits + misses), 0, 3);
  let penalty = constrain(
    (parseFloat(95) - parseFloat(hits * 100) / parseFloat(hits + misses)) * 0.2,
    0,
    100
  );
  let target_w_penalty = nf(
    test_time / parseFloat(hits + misses) + penalty,
    0,
    3
  );
  let timestamp =
    day() +
    "/" +
    month() +
    "/" +
    year() +
    "  " +
    hour() +
    ":" +
    minute() +
    ":" +
    second();

  textFont("Arial", 18);
  background(color(0, 0, 0)); // clears screen
  fill(color(255, 255, 255)); // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20); // display time on screen (top-left corner)

  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width / 2, 60);
  text("Hits: " + hits, width / 2, 100);
  text("Misses: " + misses, width / 2, 120);
  text("Accuracy: " + accuracy + "%", width / 2, 140);
  text("Total time taken: " + test_time + "s", width / 2, 160);
  text("Average time per target: " + time_per_target + "s", width / 2, 180);
  text(
    "Average time for each target (+ penalty): " + target_w_penalty + "s",
    width / 2,
    220
  );

  // Saves results (DO NOT CHANGE!)
  let attempt_data = {
    project_from: GROUP_NUMBER,
    assessed_by: student_ID,
    test_completed_by: timestamp,
    attempt: attempt,
    hits: hits,
    misses: misses,
    accuracy: accuracy,
    attempt_duration: test_time,
    time_per_target: time_per_target,
    target_w_penalty: target_w_penalty,
  };

  // Send data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE) {
    // Access the Firebase DB
    if (attempt === 0) {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }

    // Add user performance results
    let db_ref = database.ref("G" + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets) {

    for (var i = 0; i < legendas.getRowCount(); i++) {
      // Check if the user clicked over one of the targets
      if (targets[i].isDrawn() && targets[i].clicked(mouseX, mouseY)) {
        // Checks if it was the correct target
        if (targets[i].id === trials[current_trial]) hits++;
        else misses++;

        draw_targets = false;
        current_trial++; // Move on to the next trial/target
        break;
      }
      else if( i < backButtons.length && backButtons[i].clicked(mouseX, mouseY)){
        draw_targets = false;

        resetTargets();

        draw_button = true;
      }
    }

    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS) {
      testEndTime = millis();
      draw_targets = false; // Stop showing targets and the user performance results
      printAndSavePerformance(); // Print the user's results on-screen and send these to the DB
      attempt++;

      // If there's an attempt to go create a button to start this
      if (attempt < 2) {
        continue_button = createButton("START 2ND ATTEMPT");
        continue_button.mouseReleased(continueTest);
        continue_button.position(
          width / 2 - continue_button.size().width / 2,
          height / 2 - continue_button.size().height / 2
        );
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis();
  }
  else if (draw_button){
    varButton = button.clicked(mouseX, mouseY);

    if (varButton >= 0){
      wantedTargets = button.getTargets()[varButton];
      for (var i = 0; i < wantedTargets.length; i++){
        console.log(i, wantedTargets,targets[38]);
        targets[wantedTargets[i]].makeDrawable();
      }
      draw_menu = false;
      draw_targets = true;
    }
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
  // Re-randomize the trial order
  randomizeTrials();

  // Resets performance variables
  hits = 0;
  misses = 0;

  current_trial = 0;
  continue_button.remove();
}

// Creates and positions the UI targets
function createTargets(target_size) {
  // Creates targets
  for (var i = 0; i < legendas.getRowCount(); i++) {
    let target_label = legendas.getString(i, 0);
    let target_id = legendas.getNum(i, 1);
    let color = [155, 155, 155];
    let target = new Target(0, 0, target_size, target_label, target_id, color);
    targets.push(target);
  }
}

function giveTargetsPosition(target_size, horizontal_gap, vertical_gap, targetsIds) {
  // Define the margins between targets by dividing the white space
  // for the number of targets minus one
  let counter = 0;
  let endLoop = false;
  h_margin = horizontal_gap / (GRID_COLUMNS - 1);
  v_margin = vertical_gap / (GRID_ROWS - 1);
  // Set targets in a 8 x 10 grid
  for (var r = 0; r < GRID_ROWS; r++) {
    for (var c = 0; c < GRID_COLUMNS; c++) {
      let target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
      let target_y = (v_margin + target_size) * r + target_size / 2;
      //check to see if current counter is greater than targetList length
      if(counter == targetsIds.length - 1){
        targets[targetsIds[counter]].alterPosition(target_x, target_y);
        endLoop = true;
        break;
      }
      actualTarget = targets[targetsIds[counter]].getLabel();
      nextTarget = targets[targetsIds[counter]].getLabel();
      if( actualTarget[0] !== nextTarget[0]){
        counter++;
        targets[targetsIds[counter]].alterPosition(target_x, target_y);
        break;
      }
      counter++;
      targets[targetsIds[counter]].alterPosition(target_x, target_y);
    }
    if(endLoop){
      break;
    }
  }
}
  






// Clears the targets from the screen
function resetTargets(){
  for (var i = 0; i < legendas.getRowCount(); i++){
    targets[i].makeNotDrawable();
  }
}



// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
  if (fullscreen()) {
    // DO NOT CHANGE THESE!
    resizeCanvas(windowWidth, windowHeight);
    let display = new Display({ diagonal: display_size }, window.screen);
    PPI = display.ppi; // calculates pixels per inch
    PPCM = PPI / 2.54; // calculates pixels per cm

    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    screen_width = display.width * 2.54; // screen width
    screen_height = display.height * 2.54; // screen height
    let target_size = 2; // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS; // empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap = screen_height - target_size * GRID_ROWS; // empty space in cm across the y-axis (based on 8 targets per column)

    buttonSetup(
      horizontal_gap * PPCM - 80,
      vertical_gap * PPCM - 80,
      target_size * PPCM
    );

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    //TODO
    // Starts drawing targets immediately after we go fullscreen
    //TODO
    //draw_targets = true;
  }
}
