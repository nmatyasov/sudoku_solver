const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const apiRoutes = require("./src/routes/");
const { swaggerDefinition } = require("./src/config/swagger");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const { developmentConfig, productionConfig } = require("./src/config");

const initializeApp = () => {
  // select mode
  const isProduction = process.env.NODE_ENV === "production";

  // error handler
  const notFoundMiddleware = require("./src/middleware/not-found");
  const errorHandlerMiddleware = require("./src/middleware/error-handler");

  // select mode settings
  let config;
  if (isProduction) {
    config = productionConfig;
  } else {
    config = developmentConfig;
  }
  // Instantiate express
  const app = express();

  //Set body parser middleware (json to text)
  app.use(express.json());

  //Set request parser middleware
  app.use(express.urlencoded({ extended: true }));

  //Set static folder
  app.use(express.static("public"));

  //Set logger
  app.use(morgan("tiny"));

  /* securite */
  //Set security headers
  app.use(helmet());

  //Set preventing XSS Attacks
  app.use(xss());

  // Enable cross-origin access through the CORS middleware
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
  //DDos
  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );

  //Add routes
  app.use("/api", apiRoutes);

  const options = {
    ...swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ["./src/routes/*.js"],
  };

  const swaggerDocs = swaggerJSDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

  //DEFINE LAST IMPORTANT!!!!!
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);
  return app;
};
const app = initializeApp();

module.exports = app;
