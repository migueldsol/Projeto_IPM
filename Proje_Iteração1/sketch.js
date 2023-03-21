// Bakeoff #2 -- Seleção em Interfaces Densas
// IPM 2022-23, Período 3
// Entrega: até dia 31 de Março às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 10 de Abril

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 11; // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE = false; // Set to 'true' to record user results to Firebase

// Screen
let currentScreen = ""; // 0 = Main Menu, 1 = Veggies, 2 = Dairy 3 = Weird 4 = Fruit 5 = Juice

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
let trials; // contains the order of targets that activate in the test
let current_trial = 0; // the current trial number (indexes into trials array above)
let attempt = 0; // users complete each test twice to account for practice (attemps 0 and 1)

// Target list
let targets = [];

let categories = [];

const fruits = [
  5, // Avocado
  6, // Banana
  11, // Cantaloupe
  21, // Conference (Pear)
  0, // Golden (Apple)
  1, // Granny Smith (Apple)
  12, // Galia Melon
  7, // Kiwi
  8, // Lemon
  9, // Lime
  10, // Mango
  13, // Melon
  15, // Nectarine
  16, // Orange
  17, // Papaya
  18, // Passion Fruit
  2, // Pink Lady (Apple)
  19, // Peach
  20, // Anjou (Pear)
  23, // Pineapple
  24, // Plum
  25, // Pomegranate
  3, // Red Delicious (Apple)
  26, // Red Grapefruit
  22, // Kaiser (Pear)
  27, // Satsumas
  4, // Royal Gala (Apple)
  14, // Watermelon
  77, // Tomato
  76, // Beef Tomato
  78, // Vine Tomato
];

const juices = [
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

const vegetables = [
  58, // Asparagus
  59, // Aubergine
  60, // Cabbage
  61, // Carrots
  62, // Cucumber
  63, // Garlic
  64, // Ginger
  65, // Leek
  66, // Mushroom
  67, // Yellow Onion
  68, // Bell Pepper
  71, // Mild Pepper
  70, // Piri Piri
  69, // Rocoto Pepper
  72, // White Potato
  73, // Red Potato
  75, // Red Beet
  74, // Sweet Potato
  79, // Zucchini
];

const dairy = [
  37, // Bio Fat Milk
  41, // Bio Skim Milk
  42, // Bio Milk
  45, // Bio Cream
  50, // Bio Soy Milk
  38, // 0% Milk
  53, // 0% Yoghurt
  52, // Cherry Yoghurt
  55, // Mango Yoghurt
  39, // Fat Milk
  56, // Pear Yoghurt
  54, // Yoghurt
  57, // Vanilla Yoghurt
  40, // Standard Milk
  47, // Sour Milk
  46, // Sour Cream
  44, // Oat Milk
  43, // Oatghurt
  49, // Soyghurt
  48, // Bio Soyghurt
  51, // Soy Milk
];

let lists = {
  fruit: fruits,
  vegetable: vegetables,
  dairy: dairy,
  juice: juices,
};

// Ensures important data is loaded before the program starts
function preload() {
  legendas = loadTable("legendas.csv", "csv", "header");
}

// Runs once at the start
function setup() {
  createCanvas(700, 500); // window size in px before we go into fullScreen()
  frameRate(60); // frame rate (DO NOT CHANGE!)

  randomizeTrials(); // randomize the trial order at the start of execution
  drawUserIDScreen(); // draws the user start-up screen (student ID and display size)
}

function createMenu() {
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  let Width = 5 * PPCM;
  let Height = 2.5 * PPCM;

  let positions = [
    { x: 0, y: 0 },
    { x: windowWidth - Width, y: 0 },
    { x: 0, y: windowHeight - Height },
    { x: windowWidth - Width, y: windowHeight - Height },
    { x: centerX - Width / 2, y: centerY - Height / 2 },
  ];

  let labels = ["fruit", "vegetable", "weird", "dairy", "juice"];

  for (let i = 0; i < positions.length; i++) {
    console.log(positions.length);
    let pos = positions[i];
    let label = labels[i];
    categories.push(new buttons(pos.x, pos.y, Width, Height, label));
  }
  console.log(categories);
}
// Runs every frame and redraws the screen
function draw() {
  if (draw_targets && attempt < 2) {
    //(draw_targets && attempt < 2)
    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0)); // sets background to black

    // Print trial count at the top center of the canvas
    textFont("Arial", 16);
    fill(color(255, 255, 255));
    textAlign(CENTER, TOP);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
    if (currentScreen === "Main Menu") {
      for (let i = 0; i < categories.length; i++) {
        categories[i].draw();
      }
    } else if (currentScreen !== "Main Menu") {
      for (var i = 0; i < vegetables.length; i++)
        targets[lists[currentScreen][i]].draw();
    }
    // // Draw all targets
    // for (var i = 0; i < legendas.getRowCount(); i++) targets[i].draw();
    // Draw the target label to be selected in the current trial
    textFont("Arial", 20);
    textAlign(CENTER, TOP);
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
    if (currentScreen === "Main Menu")
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].clicked(mouseX, mouseY)) {
          currentScreen = categories[i].label;
          console.log(currentScreen);
          break;
        }
      }
    if (currentScreen !== "Main Menu")
      for (var i = 0; i < legendas.getRowCount(); i++) {
        // Check if the user clicked over one of the targets
        if (targets[i].clicked(mouseX, mouseY)) {
          // Checks if it was the correct target
          if (targets[i].id === trials[current_trial]) hits++;
          else misses++;

          current_trial++; // Move on to the next trial/target
          currentScreen = "Main Menu";
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

  // Shows the targets again
  draw_targets = true;
}

// Creates and positions the UI targets
function createTargets(
  target_size,
  horizontal_gap,
  vertical_gap,
  column,
  row,
  lista
) {
  // Define the margins between targets by dividing the white space
  // for the number of targets minus one
  h_margin = horizontal_gap / (column - 1);
  v_margin = vertical_gap / (row - 1);

  // Calculate the total width and height of the grid
  let gridWidth = (column - 1) * h_margin + column * target_size;
  let gridHeight = (row - 1) * v_margin + row * target_size;

  // Calculate the starting point of the grid (top-left corner)
  let startX = (width - gridWidth) / 2;
  let startY = (height - gridHeight) / 2;

  // Set targets in a 8 x 10 grid
  for (var r = 0; r < row; r++) {
    for (var c = 0; c < column; c++) {
      if (c + column * r == lista.length) {
        break;
      }
      let target_x = startX + (h_margin + target_size) * c + target_size / 2;
      let target_y = startY + (v_margin + target_size) * r + target_size / 2;

      // Find the appropriate label and ID for this target
      let legendas_index = c + column * r;
      // console.log(legendas_index);
      let target_label = legendas.getString(lista[legendas_index], 0);
      let target_id = lista[legendas_index];

      let target = new Target(
        target_x,
        target_y + 40,
        target_size,
        target_label,
        target_id
      );
      targets.push(target);
    }
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
    let screen_width = display.width * 2.54; // screen width
    let screen_height = display.height * 2.54; // screen height
    let target_size = 2; // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS; // empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap = screen_height - target_size * GRID_ROWS; // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    console.log(vegetables.length);
    console.log(fruits.length);
    console.log(juices.length);
    console.log(dairy.length);
    createTargets(
      target_size * PPCM,
      horizontal_gap * PPCM - vegetables.length,
      vertical_gap * PPCM - vegetables.length,
      4,
      5,
      vegetables
    );
    createTargets(
      target_size * PPCM,
      horizontal_gap * PPCM - fruits.length,
      vertical_gap * PPCM - fruits.length,
      5,
      7,
      fruits
    );
    createTargets(
      target_size * PPCM,
      horizontal_gap * PPCM - juices.length,
      vertical_gap * PPCM - juices.length,
      5,
      2,
      juices
    );
    createTargets(
      target_size * PPCM,
      horizontal_gap * PPCM - dairy.length,
      vertical_gap * PPCM - dairy.length,
      5,
      5,
      dairy
    );

    // Starts drawing targets immediately after we go fullscreen
    createMenu();
    draw_targets = true;
    currentScreen = "Main Menu";
  }
}
