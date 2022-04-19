describe('Edit Profile', () => {
    var email = "mailaddress3@companyc.com";
    var newEmail = "mailaddress3-new@companyc.com";
    var password = 'root';
    var newPassword = 'toor';
    var wrongPassword = '1234';

    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl + "/login");
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button:contains("Sign In")').click();
        cy.get('a[href="/edit-profile"]')
            .click();
    });

    it('contains visual elements', () => {
        cy.get('p:contains(Edit profile)')
            .should('exist');

        cy.get('button:contains(Update Profile)[role="tab"]')
            .should('exist');

        cy.get('button:contains(Update Email)[role="tab"]')
            .should('exist');

        cy.get('button:contains(Update Password)[role="tab"]')
            .should('exist');
    });

    it('contains visual elements for update profile form', () => {
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

        cy.get('button:contains(Save Changes)')
            .should('exist');
    });

    it('contains visual elements for update email form', () => {
        cy.get('button:contains(Update Email)[role="tab"]')
            .click();
        cy.get('label[for="email"]')
            .should('exist');

        cy.get('button:contains(Save Changes)')
            .should('exist');
    });

    it('shows required errors in update email form', () => {
        cy.get('button:contains(Update Email)[role="tab"]')
            .click();
        cy.get('input[name="email"]').clear();

        cy.get('button:contains(Save Changes)')
            .click();
        cy.get('p:contains(this field is required)')
            .should('have.length', 1);
    });

    it('prefills current email in the update email form', () => {
        cy.get('button:contains(Update Email)[role="tab"]')
            .click();
        cy.get('input[name="email"]').should('have.value', email);
    });

    it('updates email', () => {
        cy.get('button:contains(Update Email)[role="tab"]')
            .click();
        cy.get('input[name="email"]').clear();
        cy.get('input[name="email"]').type(newEmail);

        cy.get('button:contains(Save Changes)')
            .click();
        cy.get('div:contains(User email updated)')
            .should('exist');

        cy.get('button[title="Close"]')
            .click();

        cy.get('div:contains(User email updated)')
            .should('not.exist');
        cy.get('button:contains(Logout)')
            .click();
        email = newEmail;
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button:contains("Sign In")').click();
        cy.location('pathname').should('eq', '/edit-profile');
    });

    it('contains visual elements for update password form', () => {
        cy.get('button:contains(Update Password)[role="tab"]')
            .click();
        cy.get('label[for="password"]')
            .should('exist');

        cy.get('button:contains(Save Changes)')
            .should('exist');
    });

    it('shows required errors in update password form', () => {
        cy.get('button:contains(Update Password)[role="tab"]')
            .click();
        cy.get('button:contains(Save Changes)')
            .click();
        cy.get('p:contains(this field is required)')
            .should('have.length', 2);

    });

    it('does not update password when password wrong', () => {
        cy.get('button:contains(Update Password)[role="tab"]')
            .click();
        cy.get('input[name="current-password"]').type(wrongPassword);
        cy.get('input[name="new-password"]').type(newPassword);

        cy.get('button:contains(Save Changes)')
            .click();
        cy.get('div:contains(Request failed with status code 401)')
            .should('exist');

        cy.get('button[title="Close"]')
            .click();

        cy.get('div:contains(Request failed with status code 401)')
            .should('not.exist');
    });

    it('updates password', () => {
        cy.get('button:contains(Update Password)[role="tab"]')
            .click();
        cy.get('input[name="current-password"]').type(password);
        cy.get('input[name="new-password"]').type(newPassword);

        cy.get('button:contains(Save Changes)')
            .click();
        cy.get('div:contains(User password updated)')
            .should('exist');

        cy.get('button[title="Close"]')
            .click();

        cy.get('div:contains(User password updated)')
            .should('not.exist');
        cy.get('button:contains(Logout)')
            .click();
        password = newPassword;
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button:contains("Sign In")').click();
        cy.location('pathname').should('eq', '/edit-profile');
    });
});