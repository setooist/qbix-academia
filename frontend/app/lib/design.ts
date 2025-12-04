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

export async function getDesignSystem(): Promise<DesignSystem> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: DESIGN_SYSTEM_QUERY }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch design system");

  const json = await res.json();

  return json.data.designSystem.data.attributes as DesignSystem;
}
