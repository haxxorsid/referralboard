describe('Navbar', () => {
    var existingEmail = "mailaddress1@companya.com";
    var correctPassword = 'root';
    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl + "/login");
        cy.get('input[name="email"]').type(existingEmail);
        cy.get('input[name="password"]').type(correctPassword);

        cy.get('button:contains("Sign In")')
            .click();
    });

    it('navbar exists', () => {
        cy.get('header')
            .should('exist');
    });

    it('contains visual elements', () => {
        cy.get('h6:contains(Referral Board)')
            .should('exist');

        cy.get('a[href="/"]')
            .contains('Home');

        cy.get('a[href="/edit-profile"]')
            .contains('Edit Profile');

        cy.get('a[href="/create-post"]')
            .contains('Post');

        cy.get('button:contains(Logout)')
            .should('exist');
    });

    it('redirects to pages on clicking navbuttons', () => {
        cy.get('a[href="/"]')
            .click();
        cy.location('pathname').should('eq', '/');

        cy.get('a[href="/edit-profile"]')
            .click();
        cy.location('pathname').should('eq', '/edit-profile');

        cy.get('a[href="/create-post"]')
            .click();
        cy.location('pathname').should('eq', '/create-post');
    });

    it('logs out after logging in', () => {
        cy.get('button:contains(Logout)')
            .click();
        cy.location('pathname').should('eq', '/login');
    });
});