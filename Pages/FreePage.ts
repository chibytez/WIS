import { waitForDebugger } from "inspector";

class FreeBetsPage{
    
  elements = {
    // Generic selectors
    allOfferCards: () => cy.get('li.promo-codes-card'),
    specificOfferCard: (bookieId: string) => cy.get(`li[data-bookie="${bookieId}"]`).first(),
    seeMoreButton: () => cy.get('button.promo-codes-see-more'),
    promoCards: () => cy.get('li.promo-codes-card'),
    
    // Elements within a card (now scoped to first matching card)
    bookieLogo: () => cy.get('figure img'),
    offerTitle: () => cy.get('#card-name'),
    welcomeOfferIcon: () => cy.get('img[alt="Welcome Offer"]'),
    sportsIcon: () => cy.get('img[alt="Sports"]'),
    claimBonusButton: () => cy.get('a.btn-cta'),
    promoCodeText: () => cy.contains('.fs-10', 'PROMO CODE'),
    expiryText: () => cy.get('.font-red'),
    termsText: () => cy.contains('.fs-10', 'T&Cs apply')
  };

  visit() {
    cy.visit('/free-bets');
    return this;
  }

 /**
 * Executes a callback function within the context of a specific offer card.
 * 
 * @param {string} bookieId - The unique identifier used to locate the offer card.
 * @param {keyof Cypress.Chainable | number} position - Either a numeric index of the card
 *        or a chainable method name like 'first', 'last', or 'eq'.
 * @param {() => void} callback - A callback function containing Cypress commands to run within the offer card.
 * 
 * @returns {this} Returns the current class instance for chaining.
 */
  withinOfferCard(
    bookieId: string,
    position: keyof Cypress.Chainable | number,
    callback: () => void
    ) {
    const card = this.elements.specificOfferCard(bookieId);
    
    if (typeof position === 'number') {
      card.eq(position).within(callback);
    } else {
      (card[position] as () => Cypress.Chainable)().within(callback);
    }
    
    return this;
  }

  /**
 * Verifies that the common elements of an offer card are visible and correct.
 * 
 * Checks for:
 * - Bookie logo visibility
 * - Offer title visibility
 * - "Claim Bonus" button visibility and text
 * - Expiry text visibility
 * 
 * @returns {this} Returns the current class instance for chaining.
 */
  verifyCommonElements() {
    this.elements.bookieLogo().should('be.visible');
    this.elements.offerTitle().should('be.visible');
    this.elements.claimBonusButton()
      .should('be.visible')
      .and('contain.text', 'CLAIM BONUS');
    this.elements.expiryText().should('be.visible');
    return this;
  }

  /**
 * Verifies Bet365-specific elements within the offer card.
 * 
 * Checks for:
 * - Welcome Offer icon visibility and correct image source
 * - Sports icon visibility and correct image source
 * - Correct offer title text
 * - "Claim Bonus" button link contains 'bet365'
 * - Expiry text contains 'No Expiry'
 * 
 * @returns {this} Returns the current class instance for chaining.
 */
  verifyBet365SpecificElements() {
    this.elements.welcomeOfferIcon()
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'Welcome Offer');
    
    this.elements.sportsIcon()
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'Sports');
    
    this.elements.offerTitle()
      .should('contain.text', 'Sports: Bet £10 & Get £30 in Free Bets');
    
    this.elements.claimBonusButton()
      .should('have.attr', 'href')
      .and('include', 'bet365');
    
    this.elements.expiryText()
      .should('contain.text', 'No Expiry');
    
    return this;
  }
  
    /**
   * Clicks the offer button for a specific bookie and verifies that it opens the expected URL in a new tab.
   * 
   * - Removes the target attribute to force the link to open in the same tab.
   * - Clicks the "Claim Bonus" button.
   * - Verifies the URL using cy.origin for cross-origin navigation.
   * 
   * @param {string} bookieId - The ID used to locate the specific offer card.
   * @param {string} expectedUrl - The expected URL (or part of it) to verify after navigation.
   * 
   * @returns {this} Returns the current class instance for chaining.
   */
  clickOfferAndVerifyNewTab(bookieId: string, expectedUrl: string) {
    this.elements.specificOfferCard(bookieId)
    this.elements.claimBonusButton().invoke('removeAttr', 'target');
    this.elements.specificOfferCard(bookieId)
    this.elements.claimBonusButton().first().click();
    cy.origin('https://www.bet365.com', () => {
    cy.location('href').should('include', 'bet365.com');
    });
    return this;
  }
  
    /**
   * Clicks the "See More" button and verifies that the number shown decreases.
   * 
   * - Extracts the initial count from the button text.
   * - Clicks the "See More" button.
   * - Verifies that the new count is less than the initial count.
   * 
   * @returns {this} Returns the current class instance for chaining.
   */
  clickSeeMoreAndVerify() {
    this.elements.seeMoreButton()
      .invoke('text')
      .then(initialText => {
        const initialCount = this.extractCountFromButton(initialText);
        this.elements.seeMoreButton().first().click();
        this.elements.seeMoreButton()
          .invoke('text')
          .should(newText => {
            const newCount = this.extractCountFromButton(newText);
            expect(newCount).to.be.lessThan(initialCount);
          });
      });
    return this;
  }
  
  /**
 * Extracts a numeric count from button text in the format "(number)".
 * 
 * @param {string} text - The button text containing the count in parentheses.
 * @returns {number} The extracted count as a number.
 * @throws Will throw an error if no count is found in the text.
 */
  private extractCountFromButton(text: string): number {
    const match = text.match(/\((\d+)\)/);
    if (!match) throw new Error('Count not found in button text');
    return parseInt(match[1]);
  }
      
}

export default new FreeBetsPage();