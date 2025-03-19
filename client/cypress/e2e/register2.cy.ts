describe("api testing", ()=>{
  const apiUrl="http://localhost:4500/api/auth/register";
  it("should be able to create a account", ()=>{

    cy.request({
      method: "POST",
      url: apiUrl,
      body: {
        email: "test.info@yahoo.com",
        firstname: "stephanie",
        lastname: "kenne",
        password: "123456",
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message", "test.info@yahoo.com");
    })
  })
it("should not able to create an account with icorrect credential", ()=>{
  cy.request({
    method: "POST",
    url: apiUrl,
    body: {
      email: ".com",
      firstname: "stephanie",
      lastname: "kenne",
      password: "?????",
    }
}).then((response) => {
  expect(response.status).to.eq(400);
  expect(response.body).to.have.property("message", "email ist not correct");
})
})
})
