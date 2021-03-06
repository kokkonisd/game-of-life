/**
 * Conway's Game of Life (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the main logic/animation/display code for the Game of Life.
 */

// Constants
const CELL_SIZE = 10;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const CONTROLS_HEIGHT = 150;
const STARTING_FRAMERATE = 2;
const STARTING_PERCENTAGE = 15;

// Canvas object
let canvas;

// Cells array
let cells = [];

// Helper variable to know when the animation has stalled, i.e. when the state of the board cannot change anymore
let animationStalled = false;

// Controls
let frameRateSlider;
let probabilitySlider;


/**
 * Setups the sketch.
 * 
 * Creates the canvas, sets the background color and text size, creates the sliders & reset button, launches the
 * animation.
 */
function setup ()
{
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT + CONTROLS_HEIGHT);
    background('gray');
    textSize(17);

    // Create frame rate slider
    frameRateSlider = createSlider(1, 100, STARTING_FRAMERATE, 1);
    frameRateSlider.position(windowWidth / 2 - CANVAS_WIDTH / 2 + 10,
                             CANVAS_HEIGHT + 40);

    // Create probability slider
    probabilitySlider = createSlider(0, 100, STARTING_PERCENTAGE, 1);
    probabilitySlider.position(windowWidth / 2 - CANVAS_WIDTH / 2 + 10,
                               frameRateSlider.position().y + 30);

    // Create reset button
    resetBtn = createButton('Reset');
    resetBtn.position(windowWidth / 2 - resetBtn.size().width / 2,
                      probabilitySlider.position().y + 40);
    resetBtn.mousePressed(reset);

    // Start the animation
    reset();
}


/**
 * Resizes/repositions elements when the browser window is resized.
 */
function windowResized ()
{
    // Adjust the positions of the controls
    frameRateSlider.position(windowWidth / 2 - CANVAS_WIDTH / 2 + 10,
                             CANVAS_HEIGHT + 20);

    probabilitySlider.position(windowWidth / 2 - CANVAS_WIDTH / 2 + 10,
                               frameRateSlider.position().y + 30);

    resetBtn.position(windowWidth / 2 - resetBtn.size().width / 2,
                      probabilitySlider.position().y + 50);
}


/**
 * Resets the animation.
 */
function reset ()
{
    // Un-stall animation
    animationStalled = false;

    // Fill array with cells
    for (let i = 0; i < floor(CANVAS_WIDTH / CELL_SIZE); i++) {
        cells[i] = [];
        for (let j = 0; j < floor(CANVAS_HEIGHT / CELL_SIZE); j++) {
            // Calculate a random number in [1, 100]
            let randomNum = floor(random(1, 101));
            // Cell is dead by default
            let alive = false;

            // If the number is below the probability threshold, cell starts out alive
            if (randomNum <= probabilitySlider.value()) {
                alive = true;
            }

            // Create and show cell
            cells[i][j] = new Cell(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, alive);
            cells[i][j].display();
        }
    }
}


/**
 * Draws the cells & text on the canvas, updating the animation.
 */
function draw ()
{
    // Clear canvas
    background('gray');

    // Set framerate based on slider
    frameRate(frameRateSlider.value());

    // Draw slider labels
    drawSliderLabels();

    if (!animationStalled) {
        // Update & draw cells
        animationStalled = updateAndDrawCells();
    } else {
        // Simply draw the cells
        drawCells();
        // Draw text indicating the cell animation will no longer update
        push();
        fill('#910404'); // Deep red
        textAlign(CENTER);
        text("Either all cells are dead or can no longer mutate.", CANVAS_WIDTH / 2, CANVAS_HEIGHT + 20);
        pop();
    }
}


/**
 * Draws slider labels.
 */
function drawSliderLabels()
{
    push();

    fill('black');

    textAlign(LEFT, BOTTOM);

    // Draw FPS text
    text('FPS:',
         frameRateSlider.position().x - canvas.position().x + frameRateSlider.size().width + 20,
         frameRateSlider.position().y + frameRateSlider.size().height);

    // Draw FPS value
    text(str(frameRateSlider.value()),
         frameRateSlider.position().x - canvas.position().x + frameRateSlider.size().width + 63,
         frameRateSlider.position().y + frameRateSlider.size().height);

    // Draw probability text
    text('Probability that a cell is alive at start:',
         probabilitySlider.position().x - canvas.position().x + probabilitySlider.size().width + 20,
         probabilitySlider.position().y + probabilitySlider.size().height);

    // Draw probability value
    text(str(probabilitySlider.value()) + '%',
         probabilitySlider.position().x - canvas.position().x + probabilitySlider.size().width + 300,
         probabilitySlider.position().y + probabilitySlider.size().height);

    pop();
}


/**
 * Updates and draws each cell.
 *
 * @return     {boolean}  Boolean value indicating wether or not the animation has stalled, i.e. cells can no longer
 *                        change.
 */
function updateAndDrawCells ()
{
    let stalled = true;
    let newStates = [];

    // Calculate new states of cells
    for (let i = 0; i < floor(CANVAS_WIDTH / CELL_SIZE); i++) {
        newStates[i] = [];
        for (let j = 0; j < floor(CANVAS_HEIGHT / CELL_SIZE); j++) {
            // Copy old states over
            newStates[i][j] = cells[i][j].alive;
            // Counter to count alive neighbors
            let aliveNeighbors = 0;

            // Limiters to iterate over neighbors
            let startNeighborsX = i - 1;
            let endNeighborsX = i + 1;
            let startNeighborsY = j - 1;
            let endNeighborsY = j + 1;

            // Set X limiters according to the left-right limits of the screen
            if (i == 0) {
                startNeighborsX = 0;
            } else if (i == floor(CANVAS_WIDTH / CELL_SIZE) - 1) {
                endNeighborsX = i;
            }

            // Set Y limiters according to the top-bottom limits of the screen
            if (j == 0) {
                startNeighborsY = 0;
            } else if (j == floor(CANVAS_HEIGHT / CELL_SIZE) - 1) {
                endNeighborsY = j;
            }

            // Count the neighbors that are currently alive
            for (let k = startNeighborsX; k <= endNeighborsX; k++) {
                for (let l = startNeighborsY; l <= endNeighborsY; l++) {
                    if (!(k == i && l == j) && cells[k][l].alive === true) {
                        aliveNeighbors++;
                    }
                }
            }

            // Update cell state based on the following rules:
            // 1. If cell is alive and has less than 2 or more than 3 alive neighbors, it dies
            // 2. If cell is dead and has 3 alive neighbors, it comes to life
            // 3. On other cases, cells retain their current status
            if (cells[i][j].alive) {
                if (!(aliveNeighbors === 2 || aliveNeighbors === 3)) {
                    newStates[i][j] = false;
                }
            } else {
                if (aliveNeighbors === 3) {
                    newStates[i][j] = true;
                }
            }

            // If even a single cell has changed state, the animation has not stalled
            if (newStates[i][j] != cells[i][j].alive) {
                stalled = false;
            }
        }
    }

    // Update cell states and display them
    for (let i = 0; i < floor(CANVAS_WIDTH / CELL_SIZE); i++) {
        for (let j = 0; j < floor(CANVAS_HEIGHT / CELL_SIZE); j++) {
            cells[i][j].alive = newStates[i][j];

            cells[i][j].display();
        }
    }

    return stalled;
}


/**
 * Draws cells on the canvas.
 */
function drawCells ()
{
    for (let i = 0; i < floor(CANVAS_WIDTH / CELL_SIZE); i++) {
        for (let j = 0; j < floor(CANVAS_HEIGHT / CELL_SIZE); j++) {
            cells[i][j].display();
        }
    }
}
