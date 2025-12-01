const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test("Solver should handle puzzle string of 81 characters", function (done) {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const validation = solver.validate(input);
    const result = solver.solve(input);

    assert.deepEqual(validation, { valid: true });
    assert.equal(result, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');

    done();
  });

  test("Solver should handle a puzzle string with invalid characters", function (done) {
    const input = '1.5..2.84..63.12.7.2..5.A...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const validation = solver.validate(input);
    const result = solver.solve(input);

    assert.deepEqual(validation, { error: 'puzzle has invalid characters' });
    assert.deepEqual(result, { error: 'puzzle cannot be solved' });

    done();
  });

  test("Solver should handle a puzzle string that is longer than 81 characters", function (done) {
    const input = '1.5..2.84..63.12.7.2..5.A...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.9982.7598.37598..3.8209358';
    const validation = solver.validate(input);
    const result = solver.solve(input);

    assert.deepEqual(validation, { error: 'expected puzzle to be 81 characters long' });
    assert.deepEqual(result, { error: 'puzzle cannot be solved' });

    done();
  });

  test("Solver should successfully handle row, column and region placement", function (done) {
    // The number 3 is placed between 1 and 5 at the very start of the string.
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const grid = solver.stringToGrid(input);
    const rowPlacement = solver.checkRowPlacement(grid, 0, 1, 3);
    const colPlacement = solver.checkColPlacement(grid, 0, 1, 3);
    const regionPlacement = solver.checkRegionPlacement(grid, 0, 1, 3);

    assert.equal(rowPlacement, true);
    assert.equal(colPlacement, true);
    assert.equal(regionPlacement, true);

    done();
  });

  test("Solver SHOULD NOT handle row, column and region placement", function (done) {
    // The number 2 is placed between 1 and 5 at the very start of the string.
    // Should not pass since there is a 2 already on the same row.
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const grid = solver.stringToGrid(input);
    const rowPlacement = solver.checkRowPlacement(grid, 0, 1, 2);
    const colPlacement = solver.checkColPlacement(grid, 0, 1, 2);
    const regionPlacement = solver.checkRegionPlacement(grid, 0, 1, 2);

    assert.equal(rowPlacement, false);
    assert.equal(colPlacement, false);
    assert.equal(regionPlacement, false);

    done();
  });

  test("Solver should handle row, column and region placement for occupied coordinates when value is the same", function (done) {
    // The number 1 is placed to the very first coordinate that already houses the number 1.
    // Should pass since it is the same number.
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const grid = solver.stringToGrid(input);
    const rowPlacement = solver.checkRowPlacement(grid, 0, 0, 1);
    const colPlacement = solver.checkColPlacement(grid, 0, 0, 1);
    const regionPlacement = solver.checkRegionPlacement(grid, 0, 0, 1);

    assert.equal(rowPlacement, true);
    assert.equal(colPlacement, true);
    assert.equal(regionPlacement, true);

    done();
  });

  test("Solver should handle invalid column placement", function (done) {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const grid = solver.stringToGrid(input);
    const rowPlacement = solver.checkRowPlacement(grid, 0, 1, 3);
    const colPlacement = solver.checkColPlacement(grid, 0, 2, 3);
    const regionPlacement = solver.checkRegionPlacement(grid, 0, 1, 3);

    assert.equal(rowPlacement, true);
    assert.equal(colPlacement, false);
    assert.equal(regionPlacement, true);

    done();
  });

  test("Solver should handle invalid row placement", function (done) {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const grid = solver.stringToGrid(input);
    const rowPlacement = solver.checkRowPlacement(grid, 0, 0, 9);
    const colPlacement = solver.checkColPlacement(grid, 1, 0, 9);
    const regionPlacement = solver.checkRegionPlacement(grid, 1, 0, 9);

    assert.equal(rowPlacement, false);
    assert.equal(colPlacement, true);
    assert.equal(regionPlacement, true);

    done();
  });

});
