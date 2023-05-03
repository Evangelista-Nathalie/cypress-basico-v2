/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function(){
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verificar o título da aplicação', function(){
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    })

    //Campos obrigatórios: Nome, Sobrenome, Email e Como podemos te ajudar?
    it('preencher campos obrigatórios e enviar o formulário', () => {
        cy.get('#firstName')
            .type('Romulo')
        cy.get('#lastName')
            .type('de Oliveira')
        cy.get('#email')
            .type('rroliveira@test.mail.com')
        cy.get('#open-text-area')
            .type('Gostaria de solicitar o cancelamento do meu pedido n° 2847629')
        cy.contains('button','Enviar')
            .click()
        cy.get('.success')
            .should('be.visible')
    });

    it('reduzir tempo de escrita na caixa de texto', () => {
        const longText = 'Lorem ipsum dolor sit amet. Et odit pariatur et eligendi eveniet nam molestias sint sit molestiae porro vel minus quia. Aut esse cupiditate eos fugiat recusandae est consequatur voluptatem est officia minima aut vitae nulla. Est corrupti earum hic commodi omnis sed ipsa assumenda id exercitationem commodi et illo possimus eum modi neque sed ipsum quia.'
        
        cy.get('#firstName')
            .type('Raquel')
        cy.get('#lastName')
            .type('Mustafa')
        cy.get('#email')
            .type('raquell@test.mail.com')
        cy.get('#open-text-area')
            .type(longText, {delay:0})
        cy.contains('button','Enviar')
            .click()
        cy.get('.success')
            .should('be.visible')
    });

    it('exibir mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#email')
            .type('rroliveira.test.mail.com')
        cy.contains('button','Enviar')
            .click()
        cy.get('.error')
            .should('be.visible')
    });

    it('validar que o campo telefone aceita apenas números', () => {
        cy.get('#phone')
            .type('teste')
            .should('be.empty')
    });


    it('exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName')
            .type('Ruth')
        cy.get('#lastName')
            .type('da Silva')
        cy.get('#email')
            .type('ruthSilv@test.mail.com')
        cy.get('#phone-checkbox')
            .check()
        cy.get('#open-text-area')
            .type('Gostaria de solicitar o reembolso do meu pedido n° 1289371')
        cy.contains('button','Enviar')
            .click()
        cy.get('.error')
            .should('be.visible')
    });

    it('preencher e limpar os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('Vanessa')
            .should('have.value', 'Vanessa')
            .clear()
            .should('be.empty')
        cy.get('#lastName')
            .type('Barauna')
            .should('have.value', 'Barauna')
            .clear()
            .should('be.empty')
        cy.get('#email')
            .type('nessbarauna@test.mail.com')
            .should('have.value', 'nessbarauna@test.mail.com')
            .clear()
            .should('be.empty')
        cy.get('#phone')
            .type('40028922')
            .should('have.value', '40028922')
            .clear()
            .should('be.empty')
    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.contains('button','Enviar')
            .click()
        cy.get('.error')
            .should('be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit('Claudio', 'Santana', 'claudioSantAna@test.com', 'teste')
            
        cy.get('.success')
            .should('be.visible')
    });

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    });

    it('seleciona um produto (Mentoria) por seu valor', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    });

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    });

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"]')
            .check('feedback')
            .should('have.value', 'feedback')
    });

    //comando .each é utilizado para iterar quando o cy.get retorna mais de um elemento (array)
    //comando .wrap é utilizado empacotar (isolar) o elemento e realizar comandos do cypress nele 
    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function ($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    });

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('#check input[type="checkbox"]')
        .as('checkboxes')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(input => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    //drag-and-drop simula a ação de arrastar o arquivo do computador para área de download
    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', {action: "drag-drop"})
        .should(input => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json', {encoding: null})
        .as('fixtureExample')

        cy.get('input[type="file"]')
        .selectFile('@fixtureExample')
        .should(input => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('a')
        .should('have.attr', 'target', '_blank')
    });

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('a')
        .invoke('removeAttr', 'target')
        .click()
        
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
    });

})