const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000"//"https://main.d2cpsfn3mxqyu2.amplifyapp.com",
  },
});
