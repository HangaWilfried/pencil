import { useRequests } from "./utils/request.ts";
const { fetchAllPosts, fetchAllTags, doSuccessRegistration, doFailureRegistration } = useRequests();

describe("register user", () => {
  beforeEach(() => {
    fetchAllTags();
    fetchAllPosts();

    cy.visit("/");
    cy.get("[data-test='startBtn']").as("getStarted");
    cy.get("@getStarted").should("have.text", "Sign in");

    cy.get("@getStarted").click();
    cy.get("[data-test='register-btn']").click();

    cy.get('[data-test="input-lastname"]').type("Kenne");
    cy.get('[data-test="input-firstname"]').type("stephanie");
    cy.get('[data-test="input-email"]').type("test.info@yahoo.com");
    cy.get('[data-test="input-password"]').type("1234454");
  });

  it("case:: success", () => {
    /*
     * URL -> url du serveur
     * METHOD -> GET | POST | DELETE | PUT
     * statusCode -> 100 -> 500
     * body -> la reponse du serveur qui peut etre une chaine de caractere, un boolean , un nombre , un tableau ou un objet.
     *  le body est utile lorsque le serveur est cense nous retourner quelque chose.
     * */

    //NB: toujours intercepter avant d'effectuer l'action.
    doSuccessRegistration();
    cy.get('[data-test="create-button"]').click();
  });

  context("Server error", () => {
    it("case:: 409", () => {
      doFailureRegistration(409);
      cy.get('[data-test="create-button"]').click();
      cy.get("[data-test='error-message']").should("have.text", "Conflict");
    });

    it("case:: 404", () => {
      doFailureRegistration(404);
      cy.get('[data-test="create-button"]').click();
      cy.get("[data-test='error-message']").should("have.text", "Not Found");
    });

    it("case:: 500", () => {
      doFailureRegistration(500);
      cy.get('[data-test="create-button"]').click();
      cy.get("[data-test='error-message']").should("have.text", "Internal Server Error");
    });
  });
});
