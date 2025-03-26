function interceptUserAccountCreation(statusCode: number, message: string) {
  cy.visit("/");
  cy.get("[data-test='startBtn']").as("getStarted");
  cy.get("@getStarted").should("have.text", "Sign in");

  cy.get("@getStarted").click();
  cy.get("[data-test='register-btn']").click();

  cy.get('[data-test="input-lastname"]').type("Kenne");
  cy.get('[data-test="input-firstname"]').type("stephanie");
  cy.get('[data-test="input-email"]').type("test.info@yahoo.com");
  cy.get('[data-test="input-password"]').type("1234454");

  cy.intercept(
    {
      url: "http://localhost:4500/api/auth/register",
      method: "POST",
    },
    {
      statusCode: statusCode,
    },
  );

  cy.get('[data-test="create-button"]').click();
  cy.get("[data-test='error-message']").should("have.text", message);
}

describe("register api avec intercep",() => {
  it("l`erreur du server doit apparaitre",() => {
    interceptUserAccountCreation(500, "Internal Server Error")
  })
  it("cas de not found",() => {
    interceptUserAccountCreation(404, "Not Found");
  })
  it("user deja existant",() => {
    interceptUserAccountCreation(409, "Conflict");
  })
})
