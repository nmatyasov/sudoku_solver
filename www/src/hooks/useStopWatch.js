import { useState, useEffect, useRef } from "react";

export const useStopWatch = (initialValue) => {
  const [times, setStopWatch] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const timer = useRef(null);
  //добавление лидирующих нулей
  function addZero(n) {
    return (parseInt(n, 10) < 10 ? "0" : "") + n;
  }

  useEffect(() => {
    if (isActive) {
      timer.current = setInterval(() => {
        let sec = times.seconds + 1;
        let min = Math.trunc(sec / 60);
        const hour = Math.trunc(min / 60);
        sec %= 60;
        min %= 60;
        const time = `${hour}:${addZero(min)}:${addZero(sec)}`;
        setStopWatch({ seconds: sec, formatTimes: time });
      }, 1000);
    } else if (!isActive && times.seconds !== 0) {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [isActive, times]);

  return { timer, times, setStopWatch, isActive, setIsActive };
};
