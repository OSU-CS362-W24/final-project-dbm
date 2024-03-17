it('Chart is correctly generated', () => {
  cy.visit('/')
  cy.get(':nth-child(1) > a').click()
  // even = x, odd = y
  let values = [1, 3, 2, 7, 3, 15, 4, 25, 5, 40]
  let xlabel = 'Cats'
  let ylabel = 'Dogs'
  let chartTitle = 'Cats vs. Dogs'

  cy.buildChart(chartTitle, xlabel, ylabel, values)
  
  cy.get('#chart-img').should('be.visible')
})