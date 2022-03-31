import React from "react";

import "./table.css";

export const Table = ({ onChangeInput, sudokuArr, initialValue, isSolve }) => {
  const templateCell = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  function getValue(row, col) {
    if (typeof sudokuArr[row][col] === "object") {
      const subArrayValue = sudokuArr[row][col];
      return subArrayValue[0];
    } else {
      return sudokuArr[row][col] === 0 ? "" : sudokuArr[row][col];
    }
  }
  function getValueStatus(row, col) {
    if (typeof sudokuArr[row][col] === "object") {
      return sudokuArr[row][col][1];
    } else {
      return "";
    }
  }
  return (
    <table>
      <tbody>
        {templateCell.map((row, rowIndex) => {
          return (
            <tr
              key={rowIndex}
              className={(row + 1) % 3 === 0 ? "bottomBorder" : ""}
            >
              {templateCell.map((col, colIndex) => {
                return (
                  <td
                    key={rowIndex + colIndex}
                    className={(col + 1) % 3 === 0 ? "rightBorder" : ""}
                  >
                    <input
                      onChange={(e) => onChangeInput(e, row, col)}
                      value={getValue(row, col)}
                      disabled={initialValue[row][col]}
                      className={`cellInput ${getValueStatus(row, col)}`}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
