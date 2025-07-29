import freeBetPage from '../../Pages/FreePage';

describe('Free Bets Page Tests', () => {
  beforeEach(() => {
    freeBetPage.visit()
  })

  it('Validate Page load', () => { 
    cy.intercept('GET', '*www.thepunterspage.com%2Ffree-bets%2F*').as('getFreeBets')
    cy.wait('@getFreeBets', { timeout: 20000 }).then((interception) => {
      cy.wrap(interception.response?.statusCode).should('eq', 200)
    })
    cy.url().should('contains', '/free-bets')
  })

  it('validates offer card components', () => {
      freeBetPage.withinOfferCard('bookie-67116', 'first', () => {
        freeBetPage.verifyCommonElements();
        freeBetPage.verifyBet365SpecificElements();
      });
  })

  it('Click an offer - assert new tab opens with correct URL', () =>{
    const expectedUrl = 'https://www.bet365.com/crossdomainapi/geoblock';
    
    // Method 1: Remove target attribute and test in same tab
    freeBetPage.clickOfferAndVerifyNewTab('bookie-67116', expectedUrl);
  })

  it('should load more promo codes when clicking See More button', () => {
    freeBetPage
      .clickSeeMoreAndVerify()
  });
})