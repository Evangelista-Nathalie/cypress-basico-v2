describe('Central de Atendimento ao Cliente TAT - Política de privacidade', function(){
    beforeEach(() => {
        cy.visit('./src/privacy.html')
    })

    it('testa a página da política de privacidade de forma independente', () => {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
        cy.contains('Talking About Testing').should('be.visible')
    });

})