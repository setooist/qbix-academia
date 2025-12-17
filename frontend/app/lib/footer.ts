import { request, gql } from "graphql-request";
import { FooterColumn, FooterAddress, FooterBottom } from "@/types/footer";

export async function getFooter(locale: string = "en") {
  const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`;
  const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

  const query = gql`
    query($locale: I18NLocaleCode) {
      footer(locale: $locale) {
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

  try {
    const data = await request(
      endpoint,
      query,
      { locale },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    const footer = data?.footer;

    if (!footer) {
      return { columns: [], address: null, bottom: null };
    }

    const columns: FooterColumn[] =
      footer.Column?.map((col: any) => ({
        title: col?.title || "",
        links:
          col?.links?.map((link: any) => ({
            label: link?.label || "",
            url: link?.url || "#",
            type: link?.type || "internal",
          })) || [],
      })) || [];

    const address: FooterAddress | null = footer.Address
      ? {
        title: footer.Address.title || "",
        addressLines: footer.Address.addressLines || [],
        phone: footer.Address.phone || "",
        email: footer.Address.email || "",
        workingHours: footer.Address.workingHours || "",
        mapLink: footer.Address.mapLink || "",
      }
      : null;

    const bottomItem = footer.Bottum?.[0];

    const bottom: FooterBottom | null = bottomItem
      ? {
        logo: bottomItem.logo?.[0] || null,
        altText: bottomItem.altText || "",
        link: bottomItem.link || "/",
        text: bottomItem.text || "",
      }
      : null;

    return { columns, address, bottom };
  } catch (error: any) {
    return { columns: [], address: null, bottom: null };
  }
}
