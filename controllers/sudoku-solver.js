class SudokuSolver {
  stringToGrid(puzzleString) {
    const grid = []
    for (let i = 0; i < 9; i++) {
      const row = puzzleString.slice(i * 9, i * 9 + 9).split('').map(char => char === '.' ? 0 : Number(char));
      grid.push(row);
    }
    return grid;
  }

  gridToString(grid) {
    return grid.flat().map(num => num === 0 ? '.' : num).join('');
  }

  validate(puzzleString) {
    if (!puzzleString || typeof puzzleString !== 'string') {
      return { error: 'required field missing' };
    }

    if (puzzleString.length !== 81) {
      return { error: 'expected puzzle to be 81 characters long' };
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'puzzle has invalid characters' };
    }

    return { valid: true };
  }

  checkRowPlacement(grid, row, column, value) {
    if (grid[row][column] !== 0 && grid[row][column] !== value) {
      return false;
    }

    for (let col = 0; col < 9; col++) {
      if (col !== column && grid[row][col] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(grid, row, column, value) {
    if (grid[row][column] !== 0 && grid[row][column] !== value) {
      return false;
    }

    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(grid, row, column, value) {
    if (grid[row][column] !== 0 && grid[row][column] !== value) {
      return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if ((r !== row || c !== column) && grid[r][c] === value) {
          return false;
        }
      }
    }
    return true;
  }

  isSafe(grid, row, column, value) {
    return this.checkRowPlacement(grid, row, column, value) &&
    this.checkColPlacement(grid, row, column, value) &&
    this.checkRegionPlacement(grid, row, column, value);
  }

  solve(puzzleString) {
    if (!puzzleString || typeof puzzleString !== 'string' || puzzleString.length !== 81 || /[^1-9.]/.test(puzzleString)) {
      return { error: 'puzzle cannot be solved' };
    }

    const grid = this.stringToGrid(puzzleString);

    const helper = (grid) => {
      let row = -1, column = -1;
      let isFilled = true;

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j] === 0) {
            row = i;
            column = j;
            isFilled = false;
            break;
          }
        }
        if (!isFilled) break;
      }

      if (isFilled) return true;

      for (let value = 1; value <= 9; value++) {
        if (this.isSafe(grid, row, column, value)) {
          grid[row][column] = value;

          if (helper(grid)) return true;

          grid[row][column] = 0;
        }
      }
      return false;
    };

    if (helper(grid)) {
      return this.gridToString(grid);
    } else {
      return { error: 'puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;

