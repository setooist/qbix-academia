export interface DesignSystem {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
}
const DESIGN_SYSTEM_QUERY = `
  query {
    designSystem {
      data {
        attributes {
          primaryColor
          secondaryColor
          backgroundColor
          fontFamily
          borderRadius
        }
      }
    }
  }
`;

export async function getDesignSystem(): Promise<DesignSystem | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ query: DESIGN_SYSTEM_QUERY }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("GraphQL request failed");

    const json = await res.json();
    const attributes = json?.data?.designSystem?.data?.attributes;

    if (!attributes) {
      return null;
    }

    return attributes as DesignSystem;
  } catch (error) {
    return null;
  }
}
