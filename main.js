/**
 * Conway's Game of Life (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the main logic/animation/display code for the Game of Life.
 */

// Constants
const cellSize = 10;
const canvasX = 500;
const canvasY = 500;
const controlsHeight = 150;

// Canvas object
let canvas;

// Cells array
let cells = [];

// Helper variable
let cellsAreAllDead = false;

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
    canvas = createCanvas(canvasX, canvasY + controlsHeight);
    background('gray');
    textSize(17);

    // Create frame rate slider
    frameRateSlider = createSlider(1, 100, 2, 1);
    frameRateSlider.position(windowWidth / 2 - canvasX / 2 + 10,
                             canvasY + 20);

    // Create probability slider
    probabilitySlider = createSlider(0, 100, 5, 1);
    probabilitySlider.position(windowWidth / 2 - canvasX / 2 + 10,
                               frameRateSlider.position().y + 30);

    // Create reset button
    resetBtn = createButton('Reset');
    resetBtn.position(windowWidth / 2 - resetBtn.size().width / 2,
                      probabilitySlider.position().y + 50);
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
    frameRateSlider.position(windowWidth / 2 - canvasX / 2 + 10,
                             canvasY + 20);

    probabilitySlider.position(windowWidth / 2 - canvasX / 2 + 10,
                               frameRateSlider.position().y + 30);

    resetBtn.position(windowWidth / 2 - resetBtn.size().width / 2,
                      probabilitySlider.position().y + 50);
}


/**
 * Resets the animation.
 */
function reset ()
{
     // Fill array with cells
    for (let i = 0; i < floor(canvasX / cellSize); i++) {
        cells[i] = [];
        for (let j = 0; j < floor(canvasY / cellSize); j++) {
            // Calculate a random number in [1, 100]
            let randomNum = floor(random(1, 101));
            // Cell is dead by default
            let alive = false;

            // If the number is below the probability threshold, cell starts out alive
            if (randomNum <= probabilitySlider.value()) {
                alive = true;
            }

            // Create and show cell
            cells[i][j] = new Cell(i * cellSize, j * cellSize, cellSize, alive);
            cells[i][j].display();
        }
    }

    // Enable looping
    loop();
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

    // Update & draw cells
    cellsAreAllDead = updateAndDrawCells();

    // If all cells are dead, stop the animation
    if (cellsAreAllDead) {
        noLoop();
        console.log('All cells are dead!');
    }
}


/**
 * Draws slider labels.
 */
function drawSliderLabels()
{
    push();

    fill('black');

    text('FPS:',
         frameRateSlider.position().x - canvas.position().x + frameRateSlider.size().width + 20,
         frameRateSlider.position().y + frameRateSlider.size().height);

    text(str(frameRateSlider.value()),
         frameRateSlider.position().x - canvas.position().x + frameRateSlider.size().width + 63,
         frameRateSlider.position().y + frameRateSlider.size().height);

    text('Probability that a cell is alive at start:',
         probabilitySlider.position().x - canvas.position().x + probabilitySlider.size().width + 20,
         probabilitySlider.position().y + probabilitySlider.size().height);

    text(str(probabilitySlider.value()) + '%',
         probabilitySlider.position().x - canvas.position().x + probabilitySlider.size().width + 300,
         probabilitySlider.position().y + probabilitySlider.size().height);

    pop();
}


/**
 * Updates and draws each cell.
 *
 * @return     {boolean}  Boolean value indicating wether or not all cells are now dead.
 */
function updateAndDrawCells ()
{
    let allDead = false;

    for (let i = 0; i < floor(canvasX / cellSize); i++) {
        for (let j = 0; j < floor(canvasY / cellSize); j++) {
            let aliveNeighbors = 0;

            let startNeighborsX = i - 1;
            let endNeighborsX = i + 1;
            let startNeighborsY = j - 1;
            let endNeighborsY = j + 1;

            if (i == 0) {
                startNeighborsX = 0;
            } else if (i == floor(canvasX / cellSize) - 1) {
                endNeighborsX = i;
            }

            if (j == 0) {
                startNeighborsY = 0;
            } else if (j == floor(canvasY / cellSize) - 1) {
                endNeighborsY = j;
            }

            for (let k = startNeighborsX; k <= endNeighborsX; k++) {
                for (let l = startNeighborsY; l <= endNeighborsY; l++) {
                    if (cells[k][l].alive) {
                        aliveNeighbors++;
                    }
                }
            }

            if (cells[i][j].alive) {
                if (!(aliveNeighbors === 2 || aliveNeighbors === 3)) {
                    cells[i][j].alive = false;
                }
            } else {
                if (aliveNeighbors === 3) {
                    cells[i][j].alive = true;
                }
            }

            if (cells[i][j].alive) {
                allDead = false;
            }

            cells[i][j].display();
        }
    }

    return allDead;
}
