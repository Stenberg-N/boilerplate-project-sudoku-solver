'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'missing required fields' });
      }

      const validation = solver.validate(puzzle);
      if (validation.error) {
        return res.json(validation);
      }

      const rowLetter = coordinate[0].toUpperCase();
      const colLetter = coordinate[1];

      const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
      const column = parseInt(colLetter) - 1;

      if (coordinate.length !==2 || row < 0 || row > 8 || isNaN(column) || column < 0 || column > 8) {
        return res.json({ error: 'invalid coordinate' });
      }

      const numValue = parseInt(value);
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'invalid value' });
      }

      const conflict = [];

      if (!solver.checkRowPlacement(puzzle, row, column, numValue)) {
        conflict.push("row");
      }

      if (!solver.checkColPlacement(puzzle, row, column, numValue)) {
        conflict.push("column");
      }

      if (!solver.checkRegionPlacement(puzzle, row, column, numValue)) {
        conflict.push("region");
      }

      if (conflict.length > 0) {
        res.json({ valid: false, conflict });
      } else {
        res.json({ valid: true });
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        res.json({ error: 'required field missing' });
      }

      const result = solver.solve(puzzle);

      res.json(result);

    });
};
