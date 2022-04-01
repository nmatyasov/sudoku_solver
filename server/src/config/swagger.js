//Open http://<app_host>:<app_port>/api-docs in your browser to view the documentation.
exports.swaggerDefinition = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js template server",
      version: "1.0.0",
      description: "This is a REST API application made with Express.",
    },
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development server",
    },
  ],
};
