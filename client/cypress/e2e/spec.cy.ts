
describe('Dummy Test', () => {
  it('Dummy button', () => {
      cy.visit('http://localhost:3000/');
      cy.get('#dummy').click()
      cy.get('#dummyText').should('exist').should('have.text', 'dummyData')
  });

  it('Email Form', () => {
      cy.visit('http://localhost:3000/');
      cy.get('#email').type('McKillaGorilla').should('have.value', 'McKillaGorilla')
  })
});




