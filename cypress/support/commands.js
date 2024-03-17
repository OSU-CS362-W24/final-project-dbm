// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
require("@testing-library/cypress/add-commands")

/**
 * buildChart(string title, string xlabel, string ylabel, array[int] values)
 * 
 * 
 *  This function will build a chart from 4 parameters:
 *  title: The title of the chart
 *  xlabel: the x label of the chart
 *  ylabel: the y label of the chart
 *  values: an array of x y values for the chart. X is held in the even
 *      idx's, and y is help in the odd. 
 */
Cypress.Commands.add('buildChart', (title, xlabel, ylabel, values) => {
    cy.get('#chart-title-input').type(title)
    cy.get('#x-label-input').type(xlabel)
    cy.get('#y-label-input').type(ylabel)
    
    let nthChild = 4
    // loop through the array and add the x y values
    for(let i = 0; i < values.length; i += 2){
        let x = ':nth-child(' + nthChild + ') > .x-value-input'
        nthChild += 1;
        let y = ':nth-child(' + nthChild + ') > .y-value-input'
        nthChild += 1;
        cy.get(x).type(values[i])
        cy.get(y).type(values[i + 1])
        if(i + 2 !== values.length)
            cy.get('#add-values-btn').click()
    }
    // manually set the color value as the popup causes cypress to freak out
    cy.get('#chart-color-input').then(e => {
        e.val('#31B7EA')
    })

    cy.get('#generate-chart-btn').click()
})
