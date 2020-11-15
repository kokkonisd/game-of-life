/**
 * Conway's Game of Life (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the code describing the Cell object for the Game of Life.
 */


/**
 * This class describes a cell in Conway's Game of Life.
 *
 * @class      Cell (name)
 */
class Cell {
    /**
     * Constructs a new instance of the Cell class.
     *
     * @param      {float}    x       The horizontal position of the cell.
     * @param      {float}    y       The vertical position of the cell.
     * @param      {float}    size    The size of the cell (size = width = height).
     * @param      {boolean}  alive   Boolean to indicate wether or not the cell is alive
     */
    constructor (x, y, size, alive)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.alive = alive;
        this.outline = 1;
    }


    /**
     * Displays the Cell object.
     */
    display ()
    {
        push();

        noStroke();

        if (this.alive === true) {
            fill('white');
        } else {
            fill('black');
        }

        rect(this.x + this.outline,
             this.y + this.outline,
             this.size - 2 * this.outline,
             this.size - 2 * this.outline);

        pop();
    }
}
