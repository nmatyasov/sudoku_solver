import React from "react";
import "./navbuttons.css";

export const NavButtons = ({
  onSolveHandler,
  onCheckHandler,
  onResetHandler,
  isSolve,
}) => {
  return (
    <div className="btnContainer">
      <button className="buttons btnSolve" disabled = {isSolve} onClick={onSolveHandler}>
        Solve
      </button>
      <button className="buttons btnCheck" onClick={onCheckHandler}>
        New board
      </button>
      <button className="buttons btnReset" onClick={onResetHandler}>
        Reset
      </button>
    </div>
  );
};
