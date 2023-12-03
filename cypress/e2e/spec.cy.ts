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
  it("register user", () => {
    cy.visit("/register");
    cy.get("#email").should("exist");
    cy.get("#email")
      .type("testing@gmail.com")
    cy.get("#username").should("exist");
    cy.get("#username")
      .type("testing")
    cy.get("#password").should("exist");
    cy.get("#password")
      .type("testingpassword")
    cy.get("#confirmPassword").should("exist");
    cy.get("#confirmPassword")
      .type("testingpassword")
    cy.get("#registerButton").click();
    cy.get(".error-message").should("have.text", "An account with this email address already exists.")
  });
  // it("visits /post", () => {
  //   cy.visit("/post/",{'failOnStatusCode': false});
  //   cy.get(".post-content").should("exist");
  //   cy.get("#commentInput").type("Hello!!!");
  // });

  // it("visits /editMap/", () => {
  //   cy.visit("/editMap",{'failOnStatusCode': false});
  //   cy.get(".leaflet-container").should("exist");
  //   cy.get(".rightPanel").should("exist");
  //   cy.get(".legend").should("exist");
  // });
});
