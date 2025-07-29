import { defineConfig } from "cypress";
import codeCoverage from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    "baseUrl": "https://www.thepunterspage.com",
  
  },
});
