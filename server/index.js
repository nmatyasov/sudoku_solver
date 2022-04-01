const app = require("./app");

// Start the server
const config = {
  port: process.env.PORT || 4000,
};

const server = app.listen(config.port, () => {
  console.log("Express server listening on port " + config.port);
});

module.exports = server;
