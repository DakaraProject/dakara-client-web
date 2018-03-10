describe('Login test', function() {
  it('tests login works', function() {
      cy.visit('/')
      cy.url().should('include', '/login')
      cy.get('#username').type("flore")
      cy.get('#password').type("admin")
      cy.get('.control').click()
      cy.url().should('include', '/library/song')
      cy.get('[href="/user"]').contains('flore').should('be.visible')
    })
})
