// comment for github actions
describe("Frontend Tests", () => {

  it("Search Bar", () => {
    cy.visit("/");
    cy.get("#searchInput")
      .type("McKillaGorilla")
      .should("have.value", "McKillaGorilla");
  });
  it("visits /home", () => {
    cy.visit("/");
    cy.get("#postListWrapper").should("exist");
    cy.get(".sortByMenuItem").should("exist").should("have.length", 3);
  });

  it("visits /post", () => {
    cy.visit("/post",{'failOnStatusCode': false});
    cy.get(".post-content").should("exist");
    cy.get("#commentInput").type("Hello!!!");
  });

  it("visits /editMap", () => {
    cy.visit("/editMap",{'failOnStatusCode': false});
    cy.get(".leaflet-container").should("exist");
    cy.get(".rightPanel").should("exist");
    cy.get(".legend").should("exist");
  });
});
