import { posts, tags, users } from "./data.ts";

export function useRequests() {
  const fetchAllTags = () => {
    cy.intercept(
      {
        url: "http://localhost:4500/api/tag",
        method: "GET",
      },
      {
        statusCode: 200,
        body: tags,
      },
    ).as("recupere_la_liste_des_tags");
  };

  const fetchUser = (user: { [id: string]: string }) => {
    cy.intercept(
      {
        url: "http://localhost:4500/api/user/" + user.id,
        method: "GET",
      },
      {
        statusCode: 200,
        body: user,
      },
    ).as("recuperer_les_informations_de_l_utitlisateur");
  };

  const fetchAllPosts = () => {
    cy.intercept(
      {
        url: "http://localhost:4500/api/1/post",
        method: "GET",
      },
      {
        statusCode: 200,
        body: posts,
      },
    ).as("obtenir_tous_les_posts");

    users.forEach(fetchUser);
  };

  const doSuccessRegistration = () => {
    cy.intercept(
      {
        url: "http://localhost:4500/api/auth/register",
        method: "POST",
      },
      {
        statusCode: 204,
      },
    );
  };

  const doFailureRegistration = (statusCode: number) => {
    cy.intercept(
      {
        url: "http://localhost:4500/api/auth/register",
        method: "POST",
      },
      {
        statusCode,
      },
    );
  };

  // TODO: lire sur les closures en javascript.

  return {
    fetchUser,
    fetchAllTags,
    fetchAllPosts,
    doSuccessRegistration,
    doFailureRegistration,
  };
}
