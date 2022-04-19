describe('Create Post', () => {
    var email1 = "mailaddress2@companyb.com";
    var email2 = "mailaddress1@companya.com";
    var password = 'root';

    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl + "/login");
        cy.get('input[name="email"]').type(email1);
        cy.get('input[name="password"]').type(password);
        cy.get('button:contains("Sign In")').click();
        cy.get('a[href="/create-post"]')
            .click();
    });

    it('contains visual elements', () => {
        cy.get('p:contains(Create Post)')
            .should('exist');

        cy.get('label[for="targetPosition"]')
            .should('exist');

        cy.get('label[for="message"]')
            .should('exist');

        cy.get('label[for="resume"]')
            .should('exist');

        cy.get('label[for="jobLink"]')
            .should('exist');
    });

    it('can show required errors', () => {
        cy.get('button:contains("Post")')
            .click();

        cy.get('p:contains(this field is required)')
            .should('have.length', 4);

    });

    it('can show url invalid error', () => {
        cy.get('input[name="resume"]').type('1234');

        cy.get('p:contains(Resume link must be a url and begins with http/https)')
            .should('have.length', 1);

        cy.get('input[name="jobLink"]').type('1234');

        cy.get('p:contains(Job link must be a url and begins with http/https)')
            .should('have.length', 1);
        cy.get('input[name="resume"]').clear();
        cy.get('input[name="jobLink"]').clear();
        cy.get('input[name="resume"]').type('http://google.com');

        cy.get('p:contains(Resume link must be a url and begins with http/https)')
            .should('have.length', 0);

        cy.get('input[name="jobLink"]').type('http://google.com');

        cy.get('p:contains(Job link must be a url and begins with http/https)')
            .should('have.length', 0);
    });

    it('shows one required error when one field is left blank', () => {
        cy.get('input[name="targetPosition"]').type('Software Engineer');
        cy.get('input[name="resume"]').type('http://google.com');
        cy.get('input[name="jobLink"]').type('http://google.com');

        cy.get('button:contains("Post")')
            .click();

        cy.get('p:contains(this field is required)')
            .should('have.length', 1);

        cy.get('label[for="message"]')
            .should('have.class', 'Mui-error');
        cy.get('input[name="targetPosition"]').should('have.value', 'Software Engineer');
        cy.get('input[name="resume"]').should('have.value', 'http://google.com');
        cy.get('input[name="jobLink"]').should('have.value', 'http://google.com');
    });

    it('creates posts and shows it', () => {
        cy.get('input[name="targetPosition"]').type('Software Engineer');
        cy.get('input[name="resume"]').type('http://google.com');
        cy.get('input[name="jobLink"]').type('http://google.com');
        cy.get('textarea[name="message"]').type('I have experience in distributed systems and looking for a job');

        cy.get('button:contains("Post")')
            .click();

        cy.get('div:contains(Post created)')
            .should('exist');

        cy.get('input[name="targetPosition"]').should('have.value', '');
        cy.get('input[name="resume"]').should('have.value', '');
        cy.get('input[name="jobLink"]').should('have.value', '');
        cy.get('textarea[name="message"]').should('have.value', '');

        cy.get('button[title="Close"]')
            .click();

        cy.get('div:contains(Post created)')
            .should('not.exist');

        cy.visit(Cypress.config().baseUrl);
        cy.get('p:contains("Message from You: I have experience in distributed systems and looking for a job")').should('exist');

        cy.get('button:contains(Logout)')
            .click();
        cy.get('input[name="email"]').type(email2);
        cy.get('input[name="password"]').type(password);
        cy.get('button:contains("Sign In")').click();
        cy.get('button:contains(By others for your company)')
            .click();
        cy.get('button[aria-label="show more"]').first().click();
        cy.get('p:contains("I have experience in distributed systems and looking for a job")').should('exist');
    });

});