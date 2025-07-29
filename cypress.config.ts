import { defineConfig } from "cypress";
import codeCoverage from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      codeCoverage(on, config);
      return config;
    },
    "baseUrl": "https://www.thepunterspage.com",
    specPattern: 'cypress/e2e/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
  },
  env: {
    codeCoverage: {
      exclude: ['cypress/**/*.*']
    }
  }
});
