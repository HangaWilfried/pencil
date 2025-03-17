describe('register session', () => {
    beforeEach( ()=> {
        cy.visit('/');
        cy.get("[data-test='get-started-bouton']").as("getStarted");

        cy.get("@getStarted").should("have.text", "Get started");
    
        cy.get("@getStarted").click();
        cy.get('.gap-2.text-sm > .font-bold').click();
   

    })
    it('testons register avec les donnees corrects', ()=> {
        cy.get(':nth-child(1) > label').type('Kenne');
        cy.get(':nth-child(2) > label').type('stephanie');
        cy.get(':nth-child(3) > label').type('test.info@yahoo.com');
        cy.get(':nth-child(4) > label').type('1234454');
        cy.get('form.flex > .text-white').click();

    })
    //it("message d'erreur si l'email a deja ete utilise", ()=>{

   // })
})

