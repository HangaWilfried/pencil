const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4NzYzYTdmLWU2MmUtNDY0ZS04MGJlLTBhYWE4OTM2OWEyZSIsImVtYWlsIjoianVuaW9ybGFnb3VlQGdtYWlsLmNvbSIsImxhc3RuYW1lIjoiSGFuZ2EgTGFnb3VlIiwiZmlyc3RuYW1lIjoiV2lsZnJpZWQgSnVuaW9yIiwiaWF0IjoxNzM2MzUxOTUwLCJleHAiOjE3MzYzNTU1NTB9.KGyYtOqkTgWqQxzbRIQ75w5r70LfT1FUfi1ksmpa58k";

describe("Connexion", () => {
  it("Nous devons etre capable de nous connecter a l'application", () => {
    cy.visit("/");

    cy.get("[data-test='startBtn']").as("getStarted");

    cy.get("@getStarted").should("have.text", "Get started");

    cy.get("@getStarted").click();

    cy.get("[data-test='input-email']").type("demo@example.com");
    cy.get("[data-test='input-password']").type("demo.password.example");

    cy.intercept({
      url: "/api/auth/login",
      method: "POST",
    }, {
      statusCode: 200,
      body: token,
    })

    cy.get("[data-test='login-button']").click();
  })
});
