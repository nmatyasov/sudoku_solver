import { useEffect, useState, useCallback /*,  useRef */ } from "react";
import "./App.css";

import NavButtons from "./components/navbuttons";
import Table from "./components/table";
import Timer from "./components/timer";
import Spinner from "./components/spinner";
import ModalWindow from "./components/modalwindow";
import { useFetch } from "./hooks/usefetch";
import { useGenerateSudoku } from "./hooks/usegeneratesudoku";
import { useStopWatch } from "./hooks/useStopWatch";

const initialValue = [
  [0, 0, 0, 0, 0, 0, 0, 6, 0],
  [0, 5, 7, 0, 0, 0, 0, 8, 0],
  [8, 0, 0, 3, 6, 0, 4, 5, 0],
  [5, 9, 0, 0, 7, 0, 0, 0, 6],
  [0, 0, 6, 4, 5, 0, 0, 0, 7],
  [4, 0, 3, 0, 9, 6, 0, 1, 2],
  [2, 0, 0, 0, 0, 0, 9, 0, 5],
  [0, 3, 0, 1, 2, 5, 6, 7, 8],
  [0, 8, 5, 0, 0, 0, 0, 0, 4],
];

const resetStopWatch = { seconds: 0, formatTimes: "0:00:00" };

function App() {
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initialValue));

  const { timer, times, setStopWatch, isActive, setIsActive } =
    useStopWatch(resetStopWatch);

  const { isLoaded, data, setTestableSudoku, setIsLoaded } = useFetch(
    "http://127.0.0.1:4000/api/compute"
  );
  const { sudoku, generateSudoku } = useGenerateSudoku();

  //обновляем состояние
  const applayData = useCallback(
    (value) => {
      setSudokuArr(value);
      setIsActive(false);
      clearInterval(timer.current);
    },
    [setIsActive, timer]
  );

  //следим за данными это либо начальное состояние либо решенное судоку
  useEffect(() => {
    if (!data) return;
    applayData(data.out_val);
  }, [data, applayData]);

  //следим за массивом судоку (новыми данными)
  useEffect(() => {
    if (!sudoku) return;
    applayData(sudoku);
  }, [sudoku, applayData]);

  //копирование массива
  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }
  //ручной ввод, если хочешь поиграть
  function onChangeInput(e, row, col) {
    const value = parseInt(e.target.value) || 0,
      grid = getDeepCopy(sudokuArr);
    if (value >= 1 && value <= 9) {
      grid[row][col] = value;
      setSudokuArr(grid);
    }
  }
  //запрос к серверу о решении судоку
  function onSolveHandler() {
    const in_val = { in_val: sudokuArr };
    setIsActive(true);
    setTestableSudoku(in_val);
  }
  //Генерация нового судоку
  function onCheckHandler() {
    setIsActive(true);
    generateSudoku();
    setIsActive(false);
    setIsLoaded(false);
  }
  //Сброс в исходное состояние
  function onResetHandler() {
    setSudokuArr(getDeepCopy(initialValue));
    setStopWatch(resetStopWatch);
    setIsActive(false);
    setIsLoaded(false);
  }

  return (
    <div className="App">
      <div className="App-header">
        <h3 className="headers">Sudoku solver</h3>
        <Timer currentTime={times.formatTimes} />

        <Table
          onChangeInput={onChangeInput}
          sudokuArr={sudokuArr}
          initialValue={sudokuArr}
          isSolve={isActive}
        />
        <NavButtons
          onSolveHandler={onSolveHandler}
          onCheckHandler={onCheckHandler}
          onResetHandler={onResetHandler}
          isSolve={isActive || isLoaded}
        />
      </div>
      {isActive && (
        <ModalWindow active={isActive}>
          <Spinner />
        </ModalWindow>
      )}
    </div>
  );
}

export default App;
