describe('home', () => {
    var email = "mailaddress1@companya.com";
    var password = 'root';

    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl+"/login");
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button:contains("Sign In")').click();
    });

    it('contains visual elements', () => {
      cy.get('p:contains(Posts)')
      .should('exist');

      cy.get('button:contains(By you)')
      .should('have.role', 'tab');

      cy.get('button:contains(By you)')
      .should('exist');

      cy.get('button:contains(By others for your company)')
      .should('have.role', 'tab');

      cy.get('button:contains(By you)')
      .should('exist');
    });

    it('shows posts by the current user by default', () => {

    });

    it('shows posts by others after switching the tab', () => {

    });
});