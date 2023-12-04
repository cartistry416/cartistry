describe("Post Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#email").type("testing@gmail.com");
    cy.get("#password").type("testingpassword");
    cy.get("#loginButton").click();
    cy.url().should("include", "/home");
  });
  it("create text post", () => {
    cy.get("#createPostButton").click();
    cy.url().should("include", "/editpost");
    cy.get(".title-input").type("test post one");
    cy.get(".ql-editor").type("test body post one");
    cy.get(".post-button button").click();
    cy.url().should("include", "/post");
    cy.get(".post-title").should("have.text", "test post one");
    cy.get(".post-body").should("have.text", "test body post one");
  });
  it("post exists", () => {
    cy.get(".postCardTitle:contains('test post one')").should("exist");
  });
  it("post is in my posts", () => {
    cy.get(".profileIcon").click();
    cy.get(".nav-dropdown-option span:contains('My Posts')").click();
    cy.url().should("include", "/myposts");
    cy.get(".postCardTitle:contains('test post one')").should("exist");
  });
  it("search post fail", () => {
    cy.get("#searchInput").type("no post should show");
    cy.get("input").type("{enter}");
    cy.get(".postCardTitle:contains('test post one')").should("not.exist");
  });
  it("search post", () => {
    cy.get("#searchInput").type("test post one");
    cy.get("input").type("{enter}");
    cy.get(".postCardTitle:contains('test post one')").should("exist");
  });
  it("edit post", () => {
    cy.get(".profileIcon").click();
    cy.get(".nav-dropdown-option span:contains('My Posts')").click();
    cy.get(".post-card-more-options").eq(0).click();
    cy.get(".postCardMenuItem").eq(0).click();
    cy.get(".title-input").type(" edit");
    cy.get("#editPostButton").click();
    cy.url().should("include", "/post");
    cy.get(".post-title").should("have.text", "test post one edit");
  });
  it("delete post", () => {
    cy.get(".profileIcon").click();
    cy.get(".nav-dropdown-option span:contains('My Posts')").click();
    cy.get(".post-card-more-options").eq(0).click();
    cy.get(".postCardMenuItem").eq(1).click();
    cy.get(".modalButton").click();
    cy.get(".postCardTitle:contains('test post one')").should("not.exist");
  });
});

describe("Frontend Tests", () => {
  it("Search Bar", () => {
    cy.visit("/home");
    cy.get("#searchInput")
      .type("McKillaGorilla")
      .should("have.value", "McKillaGorilla");
  });
  it("visits /home", () => {
    cy.visit("/home");
    cy.get("#postListWrapper").should("exist");
    // cy.get(".sortByMenuItem").should("exist").should("have.length", 3);
  });
  it("register page", () => {
    cy.visit("/register");
    cy.get("#email").should("exist");
    cy.get("#email")
      .type("McKillaGorilla@gmail.com")
      .should("have.value", "McKillaGorilla@gmail.com");
    cy.get("#username").should("exist");
    cy.get("#username")
      .type("McKillaGorilla")
      .should("have.value", "McKillaGorilla");
    cy.get("#password").should("exist");
    cy.get("#password")
      .type("McKillaGorillaPassword")
      .should("have.value", "McKillaGorillaPassword");
    cy.get("#confirmPassword").should("exist");
    cy.get("#confirmPassword")
      .type("McKillaGorillaPassword")
      .should("have.value", "McKillaGorillaPassword");
    // cy.get(".sortByMenuItem").should("exist").should("have.length", 3);
  });
  it("login page", () => {
    cy.visit("/");
    cy.get("#email").should("exist");
    cy.get("#email")
      .type("McKillaGorilla@gmail.com")
      .should("have.value", "McKillaGorilla@gmail.com");
    cy.get("#password").should("exist");
    cy.get("#password")
      .type("McKillaGorillaPassword")
      .should("have.value", "McKillaGorillaPassword");
  });
  it("forgot password page", () => {
    cy.visit("/requestPassword");
    cy.get("#email").should("exist");
    cy.get("#email")
      .type("McKillaGorilla@gmail.com")
      .should("have.value", "McKillaGorilla@gmail.com");
  });
  it("register user already exists", () => {
    cy.visit("/register");
    cy.get("#email").type("testing@gmail.com");
    cy.get("#username").type("testing");
    cy.get("#password").type("testingpassword");
    cy.get("#confirmPassword").type("testingpassword");
    cy.get("#registerButton").click();
    cy.get(".error-message").should(
      "have.text",
      "An account with this email address already exists."
    );
  });
  it("login user", () => {
    cy.visit("/");
    cy.get("#email").type("testing@gmail.com");
    cy.get("#password").type("testingpassword");
    cy.get("#loginButton").click();
    cy.url().should("include", "/home");
  });
});
