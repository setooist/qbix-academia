import type { Schema, Struct } from '@strapi/strapi';

export interface FooterAddress extends Struct.ComponentSchema {
  collectionName: 'components_footer_addresses';
  info: {
    displayName: 'Address';
  };
  attributes: {
    addressLines: Schema.Attribute.String & Schema.Attribute.Required;
    email: Schema.Attribute.String;
    mapLink: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    workingHours: Schema.Attribute.String;
  };
}

export interface FooterFooterBottom extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_bottoms';
  info: {
    displayName: 'Footer Bottom';
  };
  attributes: {
    altText: Schema.Attribute.String;
    link: Schema.Attribute.String;
    logo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    > &
      Schema.Attribute.Required;
    text: Schema.Attribute.String;
  };
}

export interface FooterFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_columns';
  info: {
    displayName: 'Footer Column';
  };
  attributes: {
    links: Schema.Attribute.Component<'footer.footer-links', true>;
    title: Schema.Attribute.String;
  };
}

export interface FooterFooterLinks extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_links';
  info: {
    displayName: 'Footer Links';
  };
  attributes: {
    label: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['internal', 'external']>;
    url: Schema.Attribute.String;
  };
}

export interface PageHero extends Struct.ComponentSchema {
  collectionName: 'components_page_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    buttonLink: Schema.Attribute.String;
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Blocks;
    mainTitle: Schema.Attribute.String;
    missionStatement: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
  };
}

export interface PageKeyAttribute extends Struct.ComponentSchema {
  collectionName: 'components_page_key_attributes';
  info: {
    displayName: 'Key Attribute';
  };
  attributes: {
    name: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface PageResults extends Struct.ComponentSchema {
  collectionName: 'components_page_results';
  info: {
    displayName: 'Results';
  };
  attributes: {
    statName: Schema.Attribute.String;
    statValue: Schema.Attribute.String;
  };
}

export interface PageTrustIndicator extends Struct.ComponentSchema {
  collectionName: 'components_page_trust_indicators';
  info: {
    displayName: 'Trust Indicator';
  };
  attributes: {
    pillarDescription: Schema.Attribute.String;
    pillarTitle: Schema.Attribute.String;
    trustLabel: Schema.Attribute.String;
  };
}

export interface SharedChildSubmenu extends Struct.ComponentSchema {
  collectionName: 'components_shared_child_submenus';
  info: {
    displayName: 'Child Submenu';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    target: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMenu extends Struct.ComponentSchema {
  collectionName: 'components_shared_menus';
  info: {
    displayName: 'Menu';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    submenu: Schema.Attribute.Component<'shared.submenu', true>;
    target: Schema.Attribute.String;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSubmenu extends Struct.ComponentSchema {
  collectionName: 'components_shared_submenus';
  info: {
    displayName: 'Submenu';
  };
  attributes: {
    ChildSubmenu: Schema.Attribute.Component<'shared.child-submenu', true>;
    Description: Schema.Attribute.Blocks;
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    target: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.address': FooterAddress;
      'footer.footer-bottom': FooterFooterBottom;
      'footer.footer-column': FooterFooterColumn;
      'footer.footer-links': FooterFooterLinks;
      'page.hero': PageHero;
      'page.key-attribute': PageKeyAttribute;
      'page.results': PageResults;
      'page.trust-indicator': PageTrustIndicator;
      'shared.child-submenu': SharedChildSubmenu;
      'shared.media': SharedMedia;
      'shared.menu': SharedMenu;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.submenu': SharedSubmenu;
    }
  }
}
