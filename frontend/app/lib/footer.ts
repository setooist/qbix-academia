import { request, gql } from "graphql-request";
import { FooterColumn, FooterAddress, FooterBottom } from "@/types/footer";

export async function getFooter() {
  const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`;

  const query = gql`
    query {
      footer {
        Column {
          title
          links {
            label
            url
            type
          }
        }
        Address {
          title
          addressLines
          phone
          email
          workingHours
          mapLink
        }
        Bottum {
          logo {
            url
          }
          altText
          link
          text
        }
      }
    }
  `;

  const data = await request(endpoint, query);

  const columns: FooterColumn[] = data?.footer?.Column?.map((col: any) => ({
    title: col.title,
    links: col.links.map((link: any) => ({
      label: link.label,
      url: link.url,
      type: link.type || "internal",
    })),
  })) || [];

  const address: FooterAddress | null = data?.footer?.Address
    ? {
        title: data.footer.Address.title,
        addressLines: data.footer.Address.addressLines,
        phone: data.footer.Address.phone,
        email: data.footer.Address.email,
        workingHours: data.footer.Address.workingHours,
        mapLink: data.footer.Address.mapLink,
      }
    : null;

  const bottom: FooterBottom | null = data?.footer?.Bottum?.[0]
    ? {
        logo: data.footer.Bottum[0].logo?.[0] || null,
        altText: data.footer.Bottum[0].altText || "",
        link: data.footer.Bottum[0].link || "/",
        text: data.footer.Bottum[0].text || "",
      }
    : null;

  return { columns, address, bottom };
}
