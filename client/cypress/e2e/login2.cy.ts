describe('home page', () =>{
  beforeEach ( () =>{
    cy.visit('/')
    cy.get("[data-test='startBtn']").as("getStarted");
    cy.get("@getStarted").should("have.text", "Sign in");
    cy.get("@getStarted").click();

    cy.get('[data-test="input-email"]').type('test.loging@yahoo.com');
    cy.get('[data-test="input-password"]').type('12827');

  });
  it('should allow a user to log in with valid email and pasword',()=>{
    cy.intercept(
      {
        url: "http://localhost:4500/api/auth/login",
        method: "post",
      },
      {
        statusCode: 200,
      },
    ).as("login")
    cy.clock()
    cy.get('[data-test="login-button"]').click();
    cy.get("@login").then(() => {
      cy.get("[data-test='succeed']").should("contain", "Operation succeed");
    })
    cy.tick(2000)


  })
  it('connection error',()=>{

    cy.intercept(
      {
        url: "http://localhost:4500/api/auth/login",
        method: "post",
      },
      {
        statusCode: 500,
      },
    );
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error-message"]').should("have.text", "Internal Server Error")

  })
  it('connection not found',()=>{
    cy.intercept(
      {
        url: "http://localhost:4500/api/auth/login",
        method: "post",
      },
      {
        statusCode: 404,
      },
    );
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error-message"]').should("have.text", "Not Found")

  })
});
