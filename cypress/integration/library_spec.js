describe('Song library tests', function() {
    beforeEach(function() {
        // Stub api routes
        cy.server()
        cy.route('/api/users/current/', 'fixture:users/current.json')
        cy.route('/api/library/work-types/', 'fixture:library/work-types.json')
        cy.route('/api/library/songs/?page=1', 'fixture:library/songs_page1.json')
        cy.route('/api/library/songs/?page=2', 'fixture:library/songs_page2.json')
        cy.route('/api/library/songs/?page=3', 'fixture:library/songs_page3.json')
        cy.route('/api/library/songs/?page=4', 'fixture:library/songs_page4.json')
        cy.route('/api/library/songs/?page=1&query=*', 'fixture:library/songs_query.json').as('songs_query')
        cy.route('/api/playlist/digest/', 'fixture:playlist/digest.json')
        cy.route('/api/playlist/entries/', 'fixture:playlist/entries.json')
        cy.route('/api/playlist/played-entries/', 'fixture:playlist/played-entries.json')

        // visits home page
        // with token set, to appear logged in
        cy.visit('/', {
            onBeforeLoad: win => {
                win.localStorage.setItem("redux", JSON.stringify({token: "tokenString"}))
            }
        })
    })

    it('displays songs details in compact and expanded form', function() {
        cy.url().should('include', '/library/song')

        // check the second song in list
        cy.get('.library-entry-song:nth-child(2)').as('song2')

        // check basic info about a song are displayed 
        cy.get('@song2').should('be.visible')
            .and('contain', 'BlackRunning') // title
            .and('contain', 'versultimate version') // version
            .and('contain', 'Super work') // work
            .and('contain', 'OP2') // work link
            .and('contain', 'The artist') // artist
            .and('contain', 'Artist1') // artist
            .and('contain', 'PV') // tag
            .and('contain', 'INST') // tag

        // expand listing entry
        cy.get('@song2').find('.song').click()

        // check detailed info about a song are displayed 
        cy.get('@song2').find('.library-entry-song-expanded').should('be.visible')
            .and('contain', 'Super work') // work
            .and('contain', 'Opening2') // work link
            .and('contain', 'The artist') // artist
            .and('contain', 'Artist1') // artist
            .and('contain', 'PV') // tag
            .and('contain', 'INST') // tag
            .and('contain', 'super detail') // detail
            .and('contain', 'super video detai') // video detail
            .and('contain', 'Lalalalalalala') // Lyrics


    })

    it('searches songs and highlight result', function() {
        cy.get("#library-searchbox-fake input").type('black{enter}')

        // check request is sent
        cy.wait('@songs_query')
            .its('url')
            .should('contains', 'query=black')

        // 2 results
        cy.get('.library-entry-song').children().should('have.length', 2)

        // check highlighting
        cy.get('.library-entry-song:nth-child(1) mark').should('contain', 'Black')
        cy.get('.library-entry-song:nth-child(2) mark').should('contain', 'Black')


    })

    it('can navigate through pages', function() {
        cy.get('.paginator .control').as('controls')

        // click next page button
        cy.get('.paginator a.control').first().should('have.attr', 'href', '/library/song?page=2').click()

        // now on second page
        cy.url().should('include', '/library/song?page=2')

        // check first song of page 2
        cy.get('.library-entry-song').first().should('contain', 'Song15') 

        // go to last page
        cy.get('.paginator a.control').last().should('have.attr', 'href', '/library/song?page=4').click()

        // now on page 4
        cy.url().should('include', '/library/song?page=4')

        // check first song of page 4
        cy.get('.library-entry-song').first().should('contain', 'Song9') 
    })
})
