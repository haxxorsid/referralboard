describe('Register', () => {
  var newUserEmail = (Math.random().toString(36) + '00000000000000000').slice(2, 8 + 2) + "@companya.com";
  var password = 'root';
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + "/register");
  });

  it('can visit register page', () => {
    cy.get('h1:contains(Register)')
      .should('exist');

    cy.location('pathname').should('eq', '/register');
  });

  it('contains visual elements', () => {
    cy.get('h1:contains(Register)')
      .should('exist');

    cy.get('svg[data-testid="AppRegistrationIcon"]')
      .should('exist');

    cy.get('label[for="firstName"]')
      .should('exist');

    cy.get('label[for="lastName"]')
      .should('exist');

    cy.get('label[for="currentLocation"]')
      .should('exist');

    cy.get('label[for="currentCompanyName"]')
      .should('exist');

    cy.get('label[for="currentPosition"]')
      .should('exist');

    cy.get('label[for="school"]')
      .should('exist');

    cy.get('label[for="email"]')
      .should('exist');

    cy.get('a[href="/login"]')
      .should('exist');

    cy.get('label[for="password"]')
      .should('exist');
  });

  it('check if back to login link works', () => {
    cy.get('a[href="/login"]')
      .click();

    cy.location('pathname').should('eq', '/login');
  });

  it('can show required errors', () => {
    cy.get('button:contains("Register")')
      .click();

    cy.get('p:contains(this field is required)')
      .should('have.length', 8);

  });

  it('can show email invalid error', () => {
    cy.get('input[name="email"]').type('1234');

    cy.get('p:contains(Not a valid Email address)')
      .should('have.length', 1);
  });

  it('shows one required error when one field is left blank', () => {
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="currentLocation"]').type('California, United States');
    cy.get('input[name="currentCompanyName"]').type('Company A');
    cy.get('input[name="currentPosition"]').type('Software Engineer');
    cy.get('input[name="school"]').type('Alma Mater');
    cy.get('input[name="password"]').type(password);

    cy.get('button:contains("Register")')
      .click();

    cy.get('p:contains(this field is required)')
      .should('have.length', 1);

    cy.get('label[for="email"]')
      .should('have.class', 'Mui-error');

    cy.get('input[name="firstName"]').should('have.value', 'John');
    cy.get('input[name="lastName"]').should('have.value', 'Doe');
    cy.get('input[name="currentLocation"]').should('have.value', 'California, United States');
    cy.get('input[name="currentCompanyName"]').should('have.value', 'Company A');
    cy.get('input[name="currentPosition"]').should('have.value', 'Software Engineer');
    cy.get('input[name="school"]').should('have.value', 'Alma Mater');
    cy.get('input[name="password"]').should('have.value', password);
  });

  it('registers user and shows success toast', () => {
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="currentLocation"]').type('California, United States');
    cy.get('input[name="currentCompanyName"]').type('Company A');
    cy.get('input[name="currentPosition"]').type('Software Engineer');
    cy.get('input[name="school"]').type('Alma Mater');
    cy.get('input[name="email"]').type(newUserEmail);
    cy.get('input[name="password"]').type(password);

    cy.get('button:contains("Register")')
      .click();

    cy.get('input[name="firstName"]').should('have.value', '');
    cy.get('input[name="lastName"]').should('have.value', '');
    cy.get('input[name="currentLocation"]').should('have.value', '');
    cy.get('input[name="currentCompanyName"]').should('have.value', '');
    cy.get('input[name="currentPosition"]').should('have.value', '');
    cy.get('input[name="school"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="password"]').should('have.value', '');

    cy.get('div:contains(User registered)')
      .should('exist');

    cy.get('button[title="Close"]')
      .click();

    cy.get('div:contains(User registered)')
      .should('not.exist');

    cy.visit(Cypress.config().baseUrl + "/login");
    cy.get('input[name="email"]').type(newUserEmail);
    cy.get('input[name="password"]').type(password);

    cy.get('button:contains("Sign In")')
      .click();

    cy.location('pathname').should('eq', '/');
  });

  it('registering existing user shows error toast', () => {
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="currentLocation"]').type('California, United States');
    cy.get('input[name="currentCompanyName"]').type('Company A');
    cy.get('input[name="currentPosition"]').type('Software Engineer');
    cy.get('input[name="school"]').type('Alma Mater');
    cy.get('input[name="email"]').type(newUserEmail);
    cy.get('input[name="password"]').type(password);

    cy.get('button:contains("Register")')
      .click();

    cy.get('div:contains(Request failed with status code 400)')
      .should('exist');

    cy.get('button[title="Close"]')
      .click();

    cy.get('div:contains(Request failed with status code 400)')
      .should('not.exist');

    cy.get('input[name="firstName"]').should('have.value', 'John');
    cy.get('input[name="lastName"]').should('have.value', 'Doe');
    cy.get('input[name="currentLocation"]').should('have.value', 'California, United States');
    cy.get('input[name="currentCompanyName"]').should('have.value', 'Company A');
    cy.get('input[name="currentPosition"]').should('have.value', 'Software Engineer');
    cy.get('input[name="school"]').should('have.value', 'Alma Mater');
    cy.get('input[name="email"]').should('have.value', newUserEmail);
    cy.get('input[name="password"]').should('have.value', password);
  });

});