import { useState } from "react";

export const useGenerateSudoku = () => {
  const [sudoku, setSudoku] = useState(null);

  const generateSudoku = () => {
    let field =
      "0681594327597283416342671589934157268278936145156842973729318654813465792465729831";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let str = "";
    for (let j = 0; j < 9; j++)
      arr.push(arr.splice(Math.random() * arr.length, 1));
    for (var i = 1; i < 82; i++) {
      str += Math.random() * 10 > 5 ? String(arr[field.substr(i, 1) - 1]) : "0";
    }

    let result = [];
    for (let i = 0; i < 9; i++) {
      result[i] = [];
      for (let j = 0; j < 9; j++) {
        result[i][j] = parseInt(str[i * 9 + j]);
      }
    }
    setSudoku(result);
  };

  return { sudoku, generateSudoku };
};
