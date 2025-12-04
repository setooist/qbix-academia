import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql` || "http://localhost:1337/graphql"
);
