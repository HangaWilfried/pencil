describe("register session", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-test='startBtn']").as("getStarted");
    cy.get("@getStarted").should("have.text", "Sign in");

    cy.get("@getStarted").click();
    cy.get(".gap-2.text-sm > .font-bold").click();
  });
  it("testons register avec les donnees corrects", () => {
    cy.get('[data-test="input-lastname"]').type("Kenne");
    cy.get('[data-test="input-firstname"]').type("stephanie");
    cy.get('[data-test="input-email"]').type("test.info@yahoo.com");
    cy.get('[data-test="input-password"]').type("1234454");
    cy.get('[data-test="create-button"]').click();
  });
  //it("message d'erreur si l'email a deja ete utilise", ()=>{

  // })
});
