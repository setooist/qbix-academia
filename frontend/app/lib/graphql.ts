import { GraphQLClient } from "graphql-request";
import { DEFAULT_REVALIDATE } from "../helper/constant";

export const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql` || "http://localhost:1337/graphql",
  {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
    fetch: (url, options) =>
      fetch(url, { ...options, next: { revalidate: DEFAULT_REVALIDATE } }),
  }
);
