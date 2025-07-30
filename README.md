# WIS

# CI/CD
[![Cypress Tests](https://github.com/chibytez/WIS/actions/workflows/cypress.yml/badge.svg)](https://github.com/chibytez/WIS/actions/workflows/cypress.yml)

## install dependencies
npm install

## How to run Headed
npm test

## How to run Headless
npm run test:run

## What metrics would you track for regression confidence?
We can use cypress coverage
Note: coverage will not work because I'm testing an external website


## Third-Party API Testing Strategy
A. Intercepting Live Traffic

cy.intercept('GET', '**/api/offers*', { 
  fixture: 'bet365-offer.json' 
}).as('getOffer');

B. Full Mocking (Service Layer)
Cypress.Commands.add('mockEmptyOffers', () => {
  cy.intercept('GET', '**/api/offers*', {
    statusCode: 200,
    body: []
  });
});

// Usage
beforeEach(() => {
  cy.mockEmptyOffers();
});
