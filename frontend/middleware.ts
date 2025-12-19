import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./app/helper/locales";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales;

    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales
    );

    const locale = matchLocale(languages, locales, i18n.defaultLocale);

    return locale;
}

import { appConfig } from "./appConfig";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (appConfig.enableMultiLanguage) {
        const pathnameIsMissingLocale = i18n.locales.every(
            (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
        );

        if (pathnameIsMissingLocale) {
            const locale = getLocale(request);

            return NextResponse.redirect(
                new URL(
                    `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
                    request.url
                )
            );
        }
    } else {
        const defaultLocale = appConfig.defaultLocale || i18n.defaultLocale;

        const pathHasLocale = i18n.locales.some(
            (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        );

        if (pathHasLocale) {
            const locale = i18n.locales.find(
                (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
            );
            if (locale) {
                const newPath = pathname.replace(`/${locale}`, "") || "/";
                return NextResponse.redirect(new URL(newPath, request.url));
            }
        }

        return NextResponse.rewrite(
            new URL(
                `/${defaultLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
                request.url
            )
        );
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|txt)$).*)"],
};
