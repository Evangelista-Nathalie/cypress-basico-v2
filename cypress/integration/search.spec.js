describe('Search', () => {

    const SearchTerm = 'cypress.io'

	beforeEach(() => {
		//para tornar a busca mais robusta está sendo utilizado o cy.intercept
        //possibilita aguardar que a requisição seja concluída para seguir com os próx. passos
		cy.intercept(
		'GET',
		`**?q=${SearchTerm}**`
		).as('getSearchResults')

		cy.visit('https://duckduckgo.com/')

        cy.get('#search_form_input_homepage')
        .as('searchField')
		.should('be.visible')
	})
	it('types and hits ENTER', () => {
		cy.get('@searchField')
		.type(`${SearchTerm}{enter}`)
        //após digitar um texto para busca, ao utilizar o {downarrow} é possível selecionar os próximos resultados sugeridos. Em algusn casos necessário incluir {delay: 100}
		
		cy.wait('@getSearchResults')

        cy.get('.result')
        .should('have.length', 1)
	})
	
	it('types and clicks the magnifying glass button', () => {
        cy.get('@searchField')
		.type(SearchTerm)
        cy.get('#search_button_homepage')
        .should('be.visible')
        .click()

        cy.get('.result')
        .should('have.length', 1)
    })
	//é possível submeter os campos de um formulário passando o comando .submit()
	it('types and submits the form directly', () => {
        cy.get('@searchField')
		.type(SearchTerm)
        cy.get('form').submit()

        cy.get('.result')
        .should('have.length', 1)
    })
})