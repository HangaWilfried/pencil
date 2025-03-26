describe("register api avec intercep",()=>{
    beforeEach(() => {
        cy.visit("/");
        cy.get("[data-test='startBtn']").as("getStarted");
        cy.get("@getStarted").should("have.text", "Sign in");

        cy.get("@getStarted").click();
        cy.get("[data-test='register-btn']").click();

        cy.get('[data-test="input-lastname"]').type("Kenne");
        cy.get('[data-test="input-firstname"]').type("stephanie");
        cy.get('[data-test="input-email"]').type("test.info@yahoo.com");
        cy.get('[data-test="input-password"]').type("1234454");
    })
 it("cas d`erreur de message",()=>{



     cy.intercept(
         {
             url: "http://localhost:4500/api/auth/register",
             method: "POST",
         },
         {
             statusCode: 500,
         },
     );
     cy.get('[data-test="create-button"]').click();
     cy.get('[data-test="error-message"]').should("have.text", "Internal Server Error");
 })
    it("cas de not found",()=>{

        cy.intercept(
            {
                url: "http://localhost:4500/api/auth/register",
                method: "POST",
            },
            {
                statusCode: 404,
            },
        );

        cy.get('[data-test="create-button"]').click();
        cy.get("[data-test='error-message']").should("have.text", "Not Found");

    })
    it("cas de connection reussie",()=>{

        cy.intercept(
            {
                url: "http://localhost:4500/api/auth/register",
                method: "POST",
            },
            {
                statusCode: 200,
            },
        ).as("register");
        cy.clock()
        cy.get('[data-test="create-button"]').click();
        cy.get("@register").then(() => {
            cy.get("[data-test='succeed']").should("contain", "Operation succeed");
        })
        cy.tick(2000)
        cy.url().should("eq", "http://localhost:5173/auth/login");
    })
})
