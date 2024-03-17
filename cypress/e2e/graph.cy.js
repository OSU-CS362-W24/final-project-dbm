
it('Chart is correctly generated', () => {
  cy.visit('/')
  cy.get(':nth-child(1) > a').click()
  // even = x, odd = y
  let values = [1, 3, 2, 7, 3, 15, 4, 25, 5, 40]
  let xlabel = 'Cats'
  let ylabel = 'Dogs'
  let chartTitle = 'Cats vs. Dogs'

  cy.populateChart(chartTitle, xlabel, ylabel, values)
  cy.get('#generate-chart-btn').click()
  cy.get('#chart-img').should('be.visible')
})

// TODO: figure out why the color isn't keeping across pages. 
it('Chart data is maintained across pages ', () => {
  cy.visit('/')
  cy.get(':nth-child(1) > a').click()
  // even = x, odd = y
  let values = [1, 3, 2, 7, 3, 15, 4, 25, 5, 40]
  let xlabel = 'Cats'
  let ylabel = 'Dogs'
  let chartTitle = 'Cats vs. Dogs'

  cy.populateChart(chartTitle, xlabel, ylabel, values)

  /* SCATTER PLOT ASSERTIONS */
  cy.get(':nth-child(2) > a').click()
  cy.get('h1').should('contain.text', 'Scatter Plot Builder') // assert that we're in scatter plot

  cy.assertChartValues(chartTitle, xlabel, ylabel, values)

  /* BAR PLOT ASSERTIONS */
  cy.get(':nth-child(3) > a').click()
  cy.get('h1').should('contain.text', 'Bar Chart Builder') // assert that we're in bar chart

  cy.assertChartValues(chartTitle, xlabel, ylabel, values)

})