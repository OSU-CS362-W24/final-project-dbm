it('Chart is correctly generated', () => {
  cy.visit('/')
  cy.get(':nth-child(1) > a').click()
  // even = x, odd = y
  let values = [1, 3, 2, 7, 3, 15, 4, 25, 5, 40]
  let xlabel = 'Cats'
  let ylabel = 'Dogs'
  let chartTitle = 'Cats vs. Dogs'

  cy.populateChart(chartTitle, xlabel, ylabel, values)
  cy.get('#chart-color-input').then(e => {
    e.val('#31B7EA')
  }).trigger('change') // trigger the onchange event so the color value holds

  cy.get('#generate-chart-btn').click()
  cy.get('#chart-img').should('be.visible')
})


it('Chart data is maintained across pages ', () => {
  cy.visit('/')
  cy.get(':nth-child(1) > a').click()
  // even = x, odd = y
  let values = [1, 3, 2, 7, 3, 15, 4, 25, 5, 40]
  let xlabel = 'Cats'
  let ylabel = 'Dogs'
  let chartTitle = 'Cats vs. Dogs'

  cy.populateChart(chartTitle, xlabel, ylabel, values)
  cy.get('#chart-color-input').then(e => {
    e.val('#31B7EA')
  }).trigger('change') // trigger the onchange event so the color value holds

  /* SCATTER PLOT ASSERTIONS */
  cy.get(':nth-child(2) > a').click()
  cy.get('h1').should('contain.text', 'Scatter Plot Builder') // assert that we're in scatter plot

  cy.assertChartValues(chartTitle, xlabel, ylabel, values, '#31B7EA')

  /* BAR PLOT ASSERTIONS */
  cy.get(':nth-child(3) > a').click()
  cy.get('h1').should('contain.text', 'Bar Chart Builder') // assert that we're in bar chart

  // assert the charts values
  cy.assertChartValues(chartTitle, xlabel, ylabel, values, '#31B7EA')

})

it('Saving a chart to the gallery', () => {
  cy.visit('/')
  cy.get(':nth-child(1) > a').click()
  // even = x, odd = y
  let values = [1, 3, 2, 7, 3, 15, 4, 25, 5, 40]
  let xlabel = 'Cats'
  let ylabel = 'Dogs'
  let chartTitle = 'Cats vs. Dogs'

  cy.populateChart(chartTitle, xlabel, ylabel, values)
  cy.get('#chart-color-input').then(e => {
    e.val('#31B7EA')
  }).trigger('change') // trigger the onchange event so the color value holds

  // generate chart
  cy.get('#generate-chart-btn').click()
  cy.get('#chart-img').should('be.visible')

  // save chart
  cy.get('#save-chart-btn').click()
  cy.get('.right > a').click()

  // check that the image is there
  cy.get('.chart-card').should('be.visible')
  cy.get('.chart-title').should('contain', chartTitle)
})

it('Re-opening a saved chart ', () => {
  cy.visit('/')
  cy.get(':nth-child(1) > a').click()
  // even = x, odd = y
  let values = [1, 3, 2, 7, 3, 15, 4, 25, 5, 40]
  let xlabel = 'Cats'
  let ylabel = 'Dogs'
  let chartTitle = 'Cats vs. Dogs'
  let color = '#31B7EA'
  cy.populateChart(chartTitle, xlabel, ylabel, values)
  let document = cy.document()
  console.log(document)
  cy.get('#chart-color-input').then(e => {
    e.val(color)
  }).trigger('change') // trigger the onchange event so the color value holds

  // check that the color is there
  cy.get('#chart-color-input').should('have.value', color.toLowerCase())

  // generate chart
  cy.get('#generate-chart-btn').click()
  cy.get('#chart-img').should('be.visible')

  // save chart
  cy.get('#save-chart-btn').click()
  cy.get('.right > a').click()

  // check for the chart card in gallery
  cy.get('.chart-card').should('be.visible')
  cy.get('.chart-title').should('contain', chartTitle)
  
  // reopen chart and assert that the values are there
  cy.get('.chart-card').click()
  cy.assertChartValues(chartTitle, xlabel, ylabel, values, color)
})
