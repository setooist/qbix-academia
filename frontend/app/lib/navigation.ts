import { request, gql } from "graphql-request";

export async function getNavigation() {
  const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`;

  const headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
  };

  const query = gql`
    query {
      navigation {
        Menu {
          id
          label
          href
          target
          description
          submenu {
            id
            label
            href
            target
            Description
            ChildSubmenu {
              id
              label
              href
              target
              description
            }
          }
        }
      }
    }
  `;

  try {
    const data = await request(endpoint, query, {}, headers);

    const menuData = data?.navigation?.Menu ?? [];

    const menu = menuData.map((item: any) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      target: item.target,
      description: item.description,
      submenu: item.submenu?.map((sub: any) => ({
        id: sub.id,
        label: sub.label,
        href: sub.href,
        target: sub.target,
        Description: sub.Description,
        childSubmenu: sub.ChildSubmenu?.map((child: any) => ({
          id: child.id,
          label: child.label,
          href: child.href,
          target: child.target,
          description: child.description,
        })) ?? [],
      })) ?? [],
    }));

    return menu;
  } catch (error) {
    return [];
  }
}
