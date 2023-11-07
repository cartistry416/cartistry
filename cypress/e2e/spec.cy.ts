// comment for github actions
describe('Dummy Test', () => {
  it('Dummy button', () => {
      cy.visit('https://main.d2cpsfn3mxqyu2.amplifyapp.com/');
      cy.get('#dummy').click()
      cy.get('#dummyText').should('exist').should('have.text', JSON.stringify('dummyData'))
  });

  it('Email Form', () => {
      cy.visit('https://main.d2cpsfn3mxqyu2.amplifyapp.com/');
      cy.get('#email').type('McKillaGorilla').should('have.value', 'McKillaGorilla')

  })
});




