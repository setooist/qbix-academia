export interface FooterLink {
  label: string;
  url: string;
  type: 'internal' | 'external';
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterData {
  Seo?: any[];
  Column: FooterColumn[];
}

export interface FooterAddress {
  title: string;
  addressLines: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  mapLink?: string;
}

export interface FooterBottom {
  logo?: { url: string };
  altText?: string;
  link?: string;
  text: string;
}