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
const GRID_ROWS = 8; // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS = 10; // We divide our 80 targets in a 8x10 grid
let continue_button;
let legendas; // The item list from the "legendas" CSV

// Metrics
let testStartTime, testEndTime; // time between the start and end of one attempt (8 trials)
let hits = 0; // number of successful selections
let misses = 0; // number of missed selections (used to calculate accuracy)
let database; // Firebase DB

// Study control parameters
let draw_targets = false; // used to control what to show in draw()
let draw_menu = false; // used to control drawing the filter
let trials; // contains the order of targets that activate in the test
let current_trial = 0; // the current trial number (indexes into trials array above)
let attempt = 0; // users complete each test twice to account for practice (attemps 0 and 1)

// Target list
let targets = [];

// ButtonCat list
let buttons = [];

let screen_height = 0;
let screen_width = 0;

const orderedIdByName = [
  38, 53, 20, 28, 58, 59, 5, 6, 76, 68, 45, 37, 42, 41, 50, 48, 60, 11, 61, 34,
  52, 21, 62, 39, 33, 12, 63, 64, 0, 1, 22, 7, 65, 8, 9, 36, 10, 31, 55, 13, 71,
  66, 15, 44, 43, 16, 29, 17, 18, 19, 32, 30, 56, 23, 2, 70, 24, 25, 75, 3, 26,
  73, 69, 4, 27, 35, 46, 47, 51, 49, 40, 74, 77, 57, 78, 14, 72, 67, 54, 79,
];

const fruitsList = [
  20, // Anjou (Pear)
  5, // Avocado
  6, // Banana
  76, // Beef Tomato
  11, // Cantaloupe
  21, // Conference (Pear)
  12, // Galia Melon
  0, // Golden
  1, // Granny Smith
  22, // Kaiser (Pear)
  7, // Kiwi
  8, // Lemon
  9, // Lime
  10, // Mango
  13, // Melon
  15, // Nectarine
  16, // Orange
  17, // Papaya
  18, // Passion Fruit
  19, // Peach
  2, // Pink Lady (Apple)
  23, // Pineapple
  24, // Plum
  25, // Pomegranate
  3, // Red Delicious (Apple)
  26, // Red Grapefruit
  4, // Royal Gala (Apple)
  27, // Satsumas
  77, // Tomato
  78, // Vine Tomato
  14, // Watermelon
];

const juicesList = [
  28, // Apple Juice
  34, // Cherry Juice
  33, // Fresh Juice
  31, // Mango Juice
  36, // Mandarin Juice
  29, // Orange Juice
  32, // Peach Juice
  30, // Pear Juice
  35, // Smoothie
];

const vegetablesList = [
  58, // Asparagus
  59, // Aubergine
  68, // Bell Pepper
  60, // Cabbage
  61, // Carrots
  62, // Cucumber
  63, // Garlic
  64, // Ginger
  65, // Leek
  66, // Mushroom
  71, // Mild Pepper
  70, // Piri Piri
  69, // Rocoto Peppe
  73, // Red Potato
  75, // Red Beet
  74, // Sweet Potato
  72, // White Potato
  67, // Yellow Onion
  79, // Zucchini
];

const dairyList = [
  38, // 0% Milk
  53, // 0% Yoghurt
  37, // Bio Fat Milk
  41, // Bio Skim Milk
  42, // Bio Milk
  45, // Bio Cream
  50, // Bio Soy Milk
  48, // Bio Soyghurt
  52, // Cherry Yoghurt
  39, // Fat Milk
  55, // Mango Yoghurt
  44, // Oat Milk
  43, // Oatghurt
  56, // Pear Yoghurt
  47, // Sour Milk
  46, // Sour Cream
  49, // Soyghurt
  51, // Soy Milk
  40, // Standard Milk
  57, // Vanilla Yoghurt
  54, // Yoghurt
];

const weirdList = [];

// Ensures important data is loaded before the program starts
function preload() {
  legendas = loadTable("legendas.csv", "csv", "header");
}
function buttonSetup(firstPosition, horizontal_gap, vertical_gap, targetSize) {
  console.log(firstPosition);
  let centerX = displayWidth / 2;
  let centerY = displayHeight / 2;
  let Width = 10 * PPCM;
  let Height = 5 * PPCM;

  //creates buttons
  //Top left corner
  let fruits = new ButtonCat(0, 0, Width, Height, "fruits", fruitsList);
  //Top right corner
  let vegetables = new ButtonCat(
    windowWidth - Width,
    0,
    Width,
    Height,
    "vegetables",
    vegetablesList,
    horizontal_gap,
    vertical_gap,
    firstPosition,
    targetSize
  );
  //Top down corner
  let juices = new ButtonCat(
    0,
    windowHeight - Height,
    Width,
    Height,
    "juices",
    juicesList,
    horizontal_gap,
    vertical_gap,
    firstPosition,
    targetSize
  );
  //Bottom right corner
  let milks = new ButtonCat(
    windowWidth - Width,
    windowHeight - Height,
    Width,
    Height,
    "dairy",
    dairyList,
    horizontal_gap,
    vertical_gap,
    firstPosition,
    targetSize
  );
  //middle
  let weirds = new ButtonCat(
    centerX - Width / 2,
    centerY - Height / 2,
    Width,
    Height,
    "weird",
    weirdList,
    horizontal_gap,
    vertical_gap,
    firstPosition,
    targetSize
  );

  buttons.push(fruits);
  buttons.push(vegetables);
  buttons.push(juices);
  buttons.push(milks);
  buttons.push(weirds);
  console.log(fruits);
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
      if (targets[i].isDrawn) {
        targets[i].draw();
      }
    }

    // Draw the target label to be selected in the current trial
    textFont("Arial", 20);
    textAlign(CENTER);
    text(legendas.getString(trials[current_trial], 0), width / 2, height - 20);
  } else if (draw_menu) {
    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0)); // sets background to black

    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255, 255, 255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    // Draw all targets
    for (var i = 0; i < 5; i++) buttons[i].draw();

    // Draw the target label to be selected in the current trial
    textFont("Arial", 20);
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

        current_trial++; // Move on to the next trial/target
        break;
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
  if (draw_menu) {
    for (var i = 0; i < 5; i++) {
      // Check if the user clicked over one of the buttons
      if (buttons[i].clicked(mouseX, mouseY)) {
        j = 0;
        k = 0;
        changeIdList = buttons[i].getTargets();
        console.log(changeIdList);
        //positionList = buttons[i].getPositionList();
        while (j < legendas.getRowCount() || k > changeIdList.length) {
          console.log(targets[j].getId());
          if (targets[j].getId() == changeIdList[k]) {
            //targets[j].alterTarget(positionList[k][0], positionList[k][1]);
            targets[j].makeDrawable();
            console.log(targets[j].isDrawn());
            k++;
          }
          j++;
        }
      }
    }
    draw_menu = false;
    draw_targets = true;
  }
  //TODO add verify of button
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

  // Shows the filter again
  draw_menu = true;
}

// // Creates and positions the UI targets
// function createTargets(target_size) {
//   // Creates targets
//   for (var i = 0; i < legendas.getRowCount(); i++) {
//     id = orderedIdByName[i];
//     let target_label = legendas.getString(id, 0);
//     let target_id = legendas.getNum(id, 1);

//     let target = new Target(0, 0, target_size, target_label, target_id);
//     targets.push(target);
//   }
// }

// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap) {
  // Define the margins between targets by dividing the white space
  // for the number of targets minus one
  h_margin = horizontal_gap / (GRID_COLUMNS - 1);
  v_margin = vertical_gap / (GRID_ROWS - 1);

  // Set targets in a 8 x 10 grid
  i = 0;
  for (var r = 0; r < GRID_ROWS; r++) {
    for (var c = 0; c < GRID_COLUMNS; c++) {
      let target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
      let target_y = (v_margin + target_size) * r + target_size / 2;

      // Find the appropriate label and ID for this target
      let legendas_index = orderedIdByName[i];
      let target_label = legendas.getString(legendas_index, 0);
      let target_id = legendas.getNum(legendas_index, 1);

      let target = new Target(
        target_x,
        target_y + 40,
        target_size,
        target_label,
        target_id
      );
      targets.push(target);
      console.log(target);
      i++;
    }
  }
}

//function givePostion(button)

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
    console.log(PPCM);

    // let firstPosition = {
    //   //top right corner
    //   vegetables: [
    //     screen_width -
    //       target_size / 2 -
    //       0.2 -
    //       target_size * 4 -
    //       horizontal_gap * 4,
    //     target_size / 2 + 0.2,
    //   ],
    //   dairy: [
    //     target_size / 2 + 0.2,
    //     target_size / 2 + 0.2 + 4 * target_size + 4 * vertical_gap,
    //   ],
    //   fruits: [target_size / 2 + 0.2, target_size / 2 + 0.2],
    //   juices: [
    //     screen_width -
    //       target_size / 2 -
    //       0.2 -
    //       target_size * 4 -
    //       horizontal_gap * 4,
    //     screen_height - target_size / 2 - 0.2 - target_size * 4 - vertical_gap,
    //   ],
    //   weird: 0,
    // };

    createTargets(
      target_size * PPCM,
      horizontal_gap * PPCM - 80,
      vertical_gap * PPCM - 80
    );

    draw_menu = true;
    buttonSetup(123, horizontal_gap, vertical_gap, target_size);

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    //TODO
    // Starts drawing targets immediately after we go fullscreen
    //TODO
    //draw_targets = true;
  }
}
