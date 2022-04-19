describe('Login', () => {
  var randomUnregisteredEmail = (Math.random().toString(36) + '00000000000000000').slice(2, 8 + 2) + "@companya.com";
  var existingEmail = "mailaddress1@companya.com";
  var correctPassword = 'root';
  var wrongPassword = 'test123';
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + "/login");
  });

  it('can visit login page', () => {
    cy.get('h1:contains(Sign in)')
      .should('exist');

    cy.location('pathname').should('eq', '/login');
  });

  it('contains visual elements', () => {
    cy.get('h1:contains(Sign in)')
      .should('exist');

    cy.get('svg[data-testid="LockOutlinedIcon"]')
      .should('exist');

    cy.get('a[href="/register"]')
      .should('exist');
  });

  it('check if back to register link works', () => {
    cy.get('a[href="/register"]')
      .click();

    cy.location('pathname').should('eq', '/register');
  });

  it('can show required errors', () => {
    cy.get('button:contains("Sign In")')
      .click();

    cy.get('p:contains(this field is required)')
      .should('have.length', 2);

  });

  it('can show email invalid error', () => {
    cy.get('input[name="email"]').type('1234');

    cy.get('p:contains(Not a valid Email address)')
      .should('have.length', 1);
  });

  it('shows one required error when one field is left blank', () => {
    cy.get('input[name="password"]').type(correctPassword);

    cy.get('button:contains("Sign In")')
      .click();

    cy.get('p:contains(this field is required)')
      .should('have.length', 1);

    cy.get('label[for="email"]')
      .should('have.class', 'Mui-error');

    cy.get('input[name="password"]').should('have.value', correctPassword);
  });

  it('logs in with an existing user and redirects to home', () => {
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="password"]').type(correctPassword);

    cy.get('button:contains("Sign In")')
      .click();

    cy.location('pathname').should('eq', '/');
  });

  it('tries to logs in with non-existing user and shows error', () => {
    cy.get('input[name="email"]').type(randomUnregisteredEmail);
    cy.get('input[name="password"]').type(correctPassword);

    cy.get('button:contains("Sign In")')
      .click();

    cy.get('div:contains(Request failed with status code 401)')
      .should('exist');

    cy.get('button[title="Close"]')
      .click();

    cy.get('div:contains(Request failed with status code 401)')
      .should('not.exist');

    cy.get('input[name="email"]').should('have.value', randomUnregisteredEmail);
    cy.get('input[name="password"]').should('have.value', correctPassword);
  });

  it('logs in with an existing user but with invalid password and shows error', () => {
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="password"]').type(wrongPassword);

    cy.get('button:contains("Sign In")')
      .click();

    cy.get('div:contains(Request failed with status code 401)')
      .should('exist');

    cy.get('button[title="Close"]')
      .click();

    cy.get('div:contains(Request failed with status code 401)')
      .should('not.exist');

    cy.get('input[name="email"]').should('have.value', existingEmail);
    cy.get('input[name="password"]').should('have.value', wrongPassword);
  });

  it('logs in and logs out', () => {
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="password"]').type(correctPassword);

    cy.get('button:contains("Sign In")')
      .click();

    cy.get('button:contains("Logout")')
      .click();

    cy.location('pathname').should('eq', '/login');
  });

  it('can not access protected pages without login', () => {
    cy.visit(Cypress.config().baseUrl + "/");
    cy.location('pathname').should('eq', '/login');

    cy.visit(Cypress.config().baseUrl + "/edit-profile");

    cy.location('pathname').should('eq', '/login');

    //cy.visit(Cypress.config().baseUrl+"/create-post");

    //cy.location('pathname').should('eq', '/login');
  });

  it('can not access unprotected pages after login', () => {
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="password"]').type(correctPassword);

    cy.get('button:contains("Sign In")')
      .click();
    cy.wait(1000);

    cy.visit(Cypress.config().baseUrl + "/login");
    cy.location('pathname').should('eq', '/');

    cy.visit(Cypress.config().baseUrl + "/register");

    cy.location('pathname').should('eq', '/');
  });



  it('redirects to requested protected page after login', () => {
    cy.visit(Cypress.config().baseUrl + "/edit-profile");

    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="password"]').type(correctPassword);

    cy.get('button:contains("Sign In")')
      .click();
    cy.wait(1000);

    cy.location('pathname').should('eq', '/edit-profile');
  });
});