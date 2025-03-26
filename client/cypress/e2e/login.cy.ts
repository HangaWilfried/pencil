describe('home page', () =>{
beforeEach ( () =>{
    cy.visit('/');cy.visit('/');
    cy.get("[data-test='startBtn']").as("getStarted");

    cy.get("@getStarted").should("have.text", "Sign in");


    cy.get("@getStarted").click();
});
it('should allow a user to log in with valid email and pasword',()=>{
    cy.get('[data-test="input-email"]').type('test.loging@yahoo.com');
    cy.get('[data-test="input-password"]').type('12827');
    cy.get('[data-test="login-button"]').click();
})
it('should allow a user to log in with invalid email and empty password',()=>{
    cy.get('[data-test="input-email"]').type('test.');
    cy.get('[data-test="input-password"]').clear();
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error-email"] > span').should('be.visible').and('contain', 'Value is not a valid email address');
    cy.get('[data-test="error-password"] > span').should('be.visible').and('contain','Value is required');
})
it('should allow a user to log in with empty email and password',()=>{
    cy.get('[data-test="input-email"]').clear();
    cy.get('[data-test="input-password"]').clear();
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error-email"] > span').should('be.visible').and('contain', 'Value is required');
    cy.get('[data-test="error-password"] > span').should('be.visible').and('contain', 'Value is required');

})

});


