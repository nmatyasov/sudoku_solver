import React from "react";

export const Timer = ({ currentTime }) => {
  return (
    <div className="timerContainer">
      <h4>{currentTime}</h4>
    </div>
  );
};
