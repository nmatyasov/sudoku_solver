/**
 * Решаем Судоку.
 *
 * Функция решает судоку. Входной параметр -- массив 9х9 с исходными значениями.
 * Возвращает массив 9х9, каждый элемент которого является массивом из двух элементов:
 * числа и его типа. Тип показывает было ли это исходное число или число, найденное
 * в ходе решения.
 *
 * @author   Victor Grischenko <victor.grischenko@gmail.com>
 * @license  GPLv3
 */
const Sudoku = function (in_val) {
  let solved = [];
  let steps = 0;
  let backtracking_call = 0;

  initSolved(in_val);
  solve();

  /**
   * Инициализация рабочего массива
   *
   * Рабочий массив представляет собой матрицу 9х9, каждый элемент которой
   * является списком из трех элементов: число, тип элемента (in - заполнен
   * по услвоию, unknown - решение не найдено, solved - решено) и перечень
   * предполагаемых значений элемента.
   */
  function initSolved(in_val) {
    steps = 0;
    let suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
      solved[i] = [];
      for (let j = 0; j < 9; j++) {
        if (in_val[i][j]) {
          solved[i][j] = [in_val[i][j], "in", []];
        } else {
          solved[i][j] = [0, "unknown", suggest];
        }
      }
    }
  } // end of method initSolved()

  /**
   * Решение судоку
   *
   * Метод в цикле пытается решить судоку, если на текущем этапе не изменилось
   * ни одного элемента, то решение прекращается.
   */
  function solve() {
    let changed = 0;
    do {
      // сужаем множество значений для всех нерешенных чисел
      changed = updateSuggests();
      steps++;
      if (81 < steps) {
        // Зашита от цикла
        break;
      }
    } while (changed);

    if (!isSolved() && !isFailed()) {
      // используем поиск с возвратом
      backtracking();
    }
  } // end of method solve()

  /**
   * Обновляем множество предположений
   *
   * Проверяем основные правила -- уникальность в строке, столбце и секции.
   */
  function updateSuggests() {
    let changed = 0;
    let buf = arrayDiff(solved[1][3][2], rowContent(1));
    buf = arrayDiff(buf, colContent(3));
    buf = arrayDiff(buf, sectContent(1, 3));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if ("unknown" != solved[i][j][1]) {
          // Здесь решение либо найдено, либо задано
          continue;
        }

        // "Одиночка"
        changed += solveSingle(i, j);

        // "Скрытый одиночка"
        changed += solveHiddenSingle(i, j);
      }
    }
    return changed;
  } // end of methos updateSuggests()

  /**
   * Метод "Одиночка"
   */
  function solveSingle(i, j) {
    solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
    solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
    solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
    if (1 == solved[i][j][2].length) {
      // Исключили все варианты кроме одного
      markSolved(i, j, solved[i][j][2][0]);
      return 1;
    }
    return 0;
  } // end of method solveSingle()

  /**
   * Метод "Скрытый одиночка"
   */
  function solveHiddenSingle(i, j) {
    let less_suggest = lessRowSuggest(i, j);
    let changed = 0;
    if (1 == less_suggest.length) {
      markSolved(i, j, less_suggest[0]);
      changed++;
    }
    less_suggest = lessColSuggest(i, j);
    if (1 == less_suggest.length) {
      markSolved(i, j, less_suggest[0]);
      changed++;
    }
    less_suggest = lessSectSuggest(i, j);
    if (1 == less_suggest.length) {
      markSolved(i, j, less_suggest[0]);
      changed++;
    }
    return changed;
  } // end of method solveHiddenSingle()

  /**
   * Отмечаем найденный элемент
   */
  function markSolved(i, j, solve) {
    solved[i][j][0] = solve;
    solved[i][j][1] = "solved";
  } // end of method markSolved()

  /**
   * Содержимое строки
   */
  function rowContent(i) {
    let content = [];
    for (let j = 0; j < 9; j++) {
      if ("unknown" != solved[i][j][1]) {
        content[content.length] = solved[i][j][0];
      }
    }
    return content;
  } // end of method rowContent()

  /**
   * Содержимое столбца
   */
  function colContent(j) {
    let content = [];
    for (let i = 0; i < 9; i++) {
      if ("unknown" != solved[i][j][1]) {
        content[content.length] = solved[i][j][0];
      }
    }
    return content;
  } // end of method colContent()

  /**
   * Содержимое секции
   */
  function sectContent(i, j) {
    let content = [];
    let offset = sectOffset(i, j);
    for (let k = 0; k < 3; k++) {
      for (let l = 0; l < 3; l++) {
        if ("unknown" != solved[offset.i + k][offset.j + l][1]) {
          content[content.length] = solved[offset.i + k][offset.j + l][0];
        }
      }
    }
    return content;
  } // end of method sectContent()

  /**
   * Минимизированное множество предположений по строке
   */
  function lessRowSuggest(i, j) {
    let less_suggest = solved[i][j][2];
    for (let k = 0; k < 9; k++) {
      if (k == j || "unknown" != solved[i][k][1]) {
        continue;
      }
      less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
    }
    return less_suggest;
  } // end of method lessRowSuggest()

  /**
   * Минимизированное множество предположений по столбцу
   */
  function lessColSuggest(i, j) {
    let less_suggest = solved[i][j][2];
    for (let k = 0; k < 9; k++) {
      if (k == i || "unknown" != solved[k][j][1]) {
        continue;
      }
      less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
    }
    return less_suggest;
  } // end of method lessColSuggest()

  /**
   * Минимизированное множество предположений по секции
   */
  function lessSectSuggest(i, j) {
    let less_suggest = solved[i][j][2];
    let offset = sectOffset(i, j);
    for (let k = 0; k < 3; k++) {
      for (let l = 0; l < 3; l++) {
        if (
          (offset.i + k == i && offset.j + l == j) ||
          "unknown" != solved[offset.i + k][offset.j + l][1]
        ) {
          continue;
        }
        less_suggest = arrayDiff(
          less_suggest,
          solved[offset.i + k][offset.j + l][2]
        );
      }
    }
    return less_suggest;
  } // end of method lessSectSuggest()

  /**
   * Вычисление разницы между двумя массивами
   */
  function arrayDiff(ar1, ar2) {
    let arr_diff = [];
    for (let i = 0; i < ar1.length; i++) {
      let is_found = false;
      for (let j = 0; j < ar2.length; j++) {
        if (ar1[i] == ar2[j]) {
          is_found = true;
          break;
        }
      }
      if (!is_found) {
        arr_diff[arr_diff.length] = ar1[i];
      }
    }
    return arr_diff;
  } // end of method arrayDiff()

  /**
   * Уникальные значения массива
   */
  function arrayUnique(ar) {
    let sorter = {};
    for (let i = 0, j = ar.length; i < j; i++) {
      sorter[ar[i]] = ar[i];
    }
    ar = [];
    for (let i in sorter) {
      ar.push(i);
    }
    return ar;
  } // end of method arrayUnique()

  /**
   * Расчет смещения секции
   */
  function sectOffset(i, j) {
    return {
      j: Math.floor(j / 3) * 3,
      i: Math.floor(i / 3) * 3,
    };
  } // end of method sectOffset()

  /**
   * Вывод найденного решения
   */
  this.html = function () {
    let html = "<table>";
    for (let i = 0; i < 9; i++) {
      if (2 == i || 5 == i) {
        html += '<tr class="bb">';
      } else {
        html += "<tr>";
      }
      for (let j = 0; j < 9; j++) {
        html +=
          '<td class="' +
          (2 == j || 5 == j ? "rb " : "") +
          solved[i][j][1] +
          '"' +
          ("unknown" == solved[i][j][1]
            ? ' title="' + solved[i][j][2].join(", ") + '"'
            : "") +
          ">" +
          (solved[i][j][0] ? solved[i][j][0] : "&nbsp;") +
          "</td>";
      }
      html += "</tr>";
    }
    html += "</table>";
    html += "<p>Решено за " + steps + " шагов</p>";
    return html;
  }; // end of method html()

  this.toArray = function () {
    let result = [];
    for (let i = 0; i < 9; i++) {
      result[i] = [];
      for (let j = 0; j < 9; j++) {
        result[i][j] = [solved[i][j][0], solved[i][j][1]];
      }
    }
    return result;
  }; // end of method toArray()

  /**
   * Проверка на найденное решение
   */
  function isSolved() {
    let is_solved = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if ("unknown" == solved[i][j][1]) {
          is_solved = false;
        }
      }
    }
    return is_solved;
  } // end of method isSolved()

  /**
   * Публичный метод isSolved
   */
  this.isSolved = function () {
    return isSolved();
  }; // end of public method isSolved()

  /**
   * Есть ли ошибка в поиске решения
   *
   * Возвращает true, если хотя бы у одной из ненайденных ячеек
   * отсутствуют кандидаты
   */
  function isFailed() {
    let is_failed = false;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if ("unknown" == solved[i][j][1] && !solved[i][j][2].length) {
          is_failed = true;
        }
      }
    }
    return is_failed;
  } // end of method isFailed()

  /**
   * Публичный метод isFailed
   */
  this.isFailed = function () {
    return isFailed();
  }; // end of public method isFailed()

  /**
   * Мпетод поиска с возвратом
   */
  function backtracking() {
    backtracking_call++;
    // Формируем новый массив
    let in_val = [[], [], [], [], [], [], [], [], []];
    let i_min = -1,
      j_min = -1,
      suggests_cnt = 0;
    for (let i = 0; i < 9; i++) {
      in_val[i].length = 9;
      for (let j = 0; j < 9; j++) {
        in_val[i][j] = solved[i][j][0];
        if (
          "unknown" == solved[i][j][1] &&
          (solved[i][j][2].length < suggests_cnt || !suggests_cnt)
        ) {
          suggests_cnt = solved[i][j][2].length;
          i_min = i;
          j_min = j;
        }
      }
    }

    // проходим по всем элементам, находим нерешенные,
    // выбираем кандидата и пытаемся решить
    for (let k = 0; k < suggests_cnt; k++) {
      in_val[i_min][j_min] = solved[i_min][j_min][2][k];
      // инициируем новый цикл
      let sudoku = new Sudoku(in_val);
      if (sudoku.isSolved()) {
        // нашли решение
        out_val = sudoku.solved();
        // Записываем найденное решение
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if ("unknown" == solved[i][j][1]) {
              markSolved(i, j, out_val[i][j][0]);
            }
          }
        }
        return;
      }
    }
  } // end of function backtracking)(

  /**
   * Возвращает найденное решение
   */
  this.solved = function () {
    return solved;
  }; // end of solved()
}; // end of class sudoku()

module.exports = Sudoku;
