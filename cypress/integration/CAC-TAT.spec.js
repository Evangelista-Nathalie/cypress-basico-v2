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
        cy.clock()
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
        cy.contains('.success','Mensagem enviada com sucesso.')
            .should('be.visible')
        cy.tick(3000)
        cy.contains('.success','Mensagem enviada com sucesso.')
            .should('not.be.visible')
        
    });

    it('reduzir tempo de escrita na caixa de texto', () => {
        const longText = 'Lorem ipsum dolor sit amet. Et odit pariatur et eligendi eveniet nam molestias sint sit molestiae porro vel minus quia. Aut esse cupiditate eos fugiat recusandae est consequatur voluptatem est officia minima aut vitae nulla. Est corrupti earum hic commodi omnis sed ipsa assumenda id exercitationem commodi et illo possimus eum modi neque sed ipsum quia.'
        
        cy.clock()
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
        cy.contains('.success','Mensagem enviada com sucesso.')
            .should('be.visible')
        cy.tick(3000)
        cy.contains('.success','Mensagem enviada com sucesso.')
            .should('not.be.visible')
    });

    it('exibir mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.clock()
        cy.get('#email')
            .type('rroliveira.test.mail.com')
        cy.contains('button','Enviar')
            .click()
        cy.contains('.error', 'Valide os campos obrigatórios!')
            .should('be.visible')
        cy.tick(3000)
        cy.contains('.error','Valide os campos obrigatórios!')
                .should('not.be.visible')
    });

    it('validar que o campo telefone aceita apenas números', () => {
        cy.get('#phone')
            .type('teste')
            .should('be.empty')
    });


    it('exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
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
        cy.contains('.error', 'Valide os campos obrigatórios!')
            .should('be.visible')
        cy.tick(3000)
        cy.contains('.error','Valide os campos obrigatórios!')
                .should('not.be.visible')
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
        cy.clock()
        cy.contains('button','Enviar')
            .click()
        cy.contains('.error', 'Valide os campos obrigatórios!')
            .should('be.visible')
        cy.tick(3000)
        cy.contains('.error','Valide os campos obrigatórios!')
                .should('not.be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit('Claudio', 'Santana', 'claudioSantAna@test.com', 'teste')
            
        cy.contains('.success','Mensagem enviada com sucesso.')
            .should('be.visible')
        cy.tick(3000)
        cy.contains('.success','Mensagem enviada com sucesso.')
            .should('not.be.visible')
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

    Cypress._.times(3, () => {
        it('Realizar o mesmo teste várias vezes', () => {
            cy.fillMandatoryFieldsAndSubmit('Camila', 'Menezes', 'menzesmilla@mail.com', 'Teste textArea')
        });
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
        
    });

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('teste ', '20')

        cy.get('#open-text-area')
        .invoke('val', longText)
        .should('have.value', longText)
    });

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .should((response) => {
            const {status, statusText, body} = response
            expect(status).to.equal(200);
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
        })
    });

    it('encontre o gato escondido', () => {
        
        cy.get('#cat')
        .invoke('show')
        .should('be.visible')
    });
})