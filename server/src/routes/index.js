const express = require("express");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/errors");
const Sudoku = require("../utils/computeSudoku");

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to template server!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.status(StatusCodes.OK).json({ message: "Hello World!" });
  })
);

/**
 * @swagger
 * /:
 *   post:
 *     description: compute sudoku
 *     responses:
 *       200:
 *         description: Returns a sudoku json.
 */
router.post(
  "/compute",
  asyncHandler(async (req, res, next) => {
    const { in_val } = req.body;

    if (!Array.isArray(in_val) || in_val.length < 1) {
      throw new CustomError.BadRequestError("No sudoku items provided");
    }
    const sudoku = await new Sudoku(in_val);
    res
      .status(sudoku.isSolved() ? StatusCodes.OK : StatusCodes.NOT_FOUND)
      .json({
        isFailed: sudoku.isFailed(),
        isSolved: sudoku.isSolved(),
        out_val: sudoku.toArray(),
      });
  })
);

/**
 * @swagger
 * /*:
 *   get:
 *     description: Response scan end point
 *     responses:
 *       400:
 *         description: Returns a error string
 */
router.get(
  "*",
  asyncHandler(async (req, res, next) => {
    throw new CustomError.BadRequestError("what???");
  })
);

module.exports = router;
