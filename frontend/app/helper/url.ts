import { appConfig } from "@/appConfig";

export const getLocalizedHref = (href: string, locale: string) => {
    if (href.startsWith("http") || href.startsWith("#")) return href;
    const cleanHref = href.startsWith("/") ? href : `/${href}`;
    return appConfig.enableMultiLanguage ? `/${locale}${cleanHref === '/' ? '' : cleanHref}` : cleanHref;
};
