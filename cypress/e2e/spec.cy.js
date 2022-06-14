import chaiColors from 'chai-colors'
chai.use(chaiColors)

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create here a user to backend
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen'
    }).then(response => {
      console.log('response:', response.body)})
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'admin', name: 'Administer', password: 'administer'
    }).then(response => {
      console.log('response:', response.body)})
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').contains('Wrong username or password')
        .should('have.css', 'color')
        .and('be.colored', 'red')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('a blog created by cypress')
      cy.get('#blog-author').type('author of cypress')
      cy.get('#blog-url').type('url of cypress')
      cy.get('#create-button').click()
      cy.get('#view-button').contains('view')
      cy.contains('a new blog a blog created by cypress by author of cypress added')
      cy.contains('a blog created by cypress author of cypress')
    })

    describe('Users can like a blog', function() {
      beforeEach(function () {
        cy.createBlog({ author: 'first author', title: 'first title', url: 'first url', likes: 0 })
        cy.createBlog({ author: 'second author', title: 'second title', url: 'second url', likes: 0 })
        cy.createBlog({ author: 'third author', title: 'third title', url: 'third url', likes: 0 })
      })
      it('user can like one of those blogs', function () {
        cy.contains('second title')
          .contains('view')
          .click()
          .parent().parent()
          .contains('like')
          .click()

        cy.contains('second title').parent()
          .contains('likes 1')
      })
    })
  })

  describe('More than one user', function() {
    beforeEach(function() {
      // log in user here
      cy.login({ username: 'admin', password: 'administer' })
      cy.createBlog({ author: 'first author', title: 'first title', url: 'first url', likes: 0 })
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({ author: 'second author', title: 'second title', url: 'second url', likes: 0 })
      cy.createBlog({ author: 'third author', title: 'third title', url: 'third url', likes: 0 })
    })

    it('user can delete a blog that he creates', function () {
      cy.contains('second title')
        .contains('view')
        .click()
        .parent().parent()
        .contains('delete')
        .click()
      cy.contains('second title')
        .should('not.exist')
    })

    it('user cannot delete a blog that is not created by him', function () {
      cy.contains('first title')
        .contains('view')
        .click()
        .parent().parent()
        .contains('delete')
        .should('not.visible')
    })

    it('The blogs are ordered according to likes', function () {
      cy.contains('second title')
        .contains('view')
        .click()
        .parent().parent()
        .contains('like')
        .click().wait(500)
        .click().wait(500)
        .click().wait(500)
      cy.contains('third title')
        .contains('view')
        .click()
        .parent().parent()
        .contains('like')
        .click().wait(500)
        .click().wait(500)
      cy.get('.blog').eq(0).should('contain', 'second title')
      cy.get('.blog').eq(1).should('contain', 'third title')
    })
  })
})
