describe('Home', () => {
  var email = "mailaddress1@companya.com";
  var password = 'root';

  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + "/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button:contains("Sign In")').click();
  });

  it('contains visual elements', () => {
    cy.get('p:contains(Posts)')
      .should('exist');

    cy.get('button:contains(By you)[role="tab"]')
      .should('exist');

    cy.get('button:contains(By others for your company)[role="tab"]')
      .should('exist');
  });

  it('shows posts by the current user by default', () => {
    cy.get('.MuiCard-root').should('exist');
    cy.get('svg[data-testid="DeleteIcon"]')
      .should('exist');
    cy.get('button:contains("Resume")').should('exist');
    cy.get('svg[data-testid="LinkIcon"]')
      .should('exist');
    cy.get('button:contains("Job link")').should('exist');
    cy.get('.MuiTypography-h5').should('exist');
    cy.get('p:contains("Message from You: ")').should('exist');
    cy.get('p:contains("Posted at: ")').should('exist');
  });

  it('shows posts by the others user', () => {
    cy.get('button:contains(By others for your company)')
      .click();
    cy.get('.MuiCard-root').should('exist');
    cy.get('svg[data-testid="DeleteIcon"]')
      .should('not.exist');
    cy.get('button:contains("Resume")').should('exist');
    cy.get('svg[data-testid="LinkIcon"]')
      .should('exist');
    cy.get('button:contains("Job link")').should('exist');
    cy.get('.MuiTypography-h5').should('exist');
    cy.get('svg[data-testid="ExpandMoreIcon"]')
      .should('exist');
    cy.get('button[aria-label="show more"]').should('exist');
    cy.get('button[aria-label="show more"]').first().click();
    cy.get('p:contains("Message from Candidate:")').should('exist');
    cy.get('p:contains("Name: ")').should('exist');
    cy.get('p:contains("Location: ")').should('exist');
    cy.get('p:contains("Current Location: ")').should('exist');
    cy.get('p:contains("Target Position: ")').should('exist');
    cy.get('p:contains("Years of Experience: ")').should('exist');
    cy.get('p:contains("School: ")').should('exist');
    cy.get('p:contains("Posted at: ")').should('exist');
  });
});