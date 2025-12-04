export interface LogoItem {
  id: number;
  url: string;
  alternativeText?: string;
}

export interface GlobalData {
  logo?: LogoItem[];
  ctaButtonText?: string;
  ctaButtonLink?: string;
}
