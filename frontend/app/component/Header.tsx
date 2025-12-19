"use client";

import { useState, useEffect } from "react";
import type { MenuItem } from "@/types/menu";
import type { GlobalData } from "@/types/global";
import CalendorModal from "./CalendorModal";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { getLocalizedHref } from "../helper/url";

interface HeaderProps {
  menu: MenuItem[];
  global?: GlobalData;
  locale?: string;
}

export default function Header({ menu, global, locale = "en" }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);







  const logoObj = global?.logo?.[0];
  const logoUrl = logoObj?.url
    ? logoObj.url.startsWith("http")
      ? logoObj.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${logoObj.url}`
    : "";

  const ctaText = global?.ctaButtonText;
  const ctaLink = global?.ctaButtonLink;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-item")) {
        setOpenMenu(null);
        setOpenSubmenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (idx: number) => {
    setOpenMenu((prev) => (prev === idx ? null : idx));
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (idx: number) => {
    setOpenSubmenu((prev) => (prev === idx ? null : idx));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6 py-4">
        <Link href={getLocalizedHref("/", locale)} className="flex-shrink-0">
          {logoUrl && (
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={logoObj?.alternativeText || "Logo"}
              width={140}
              height={40}
              objectFit="contain"
              unoptimized
              className="h-10 w-auto"
            />
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-1 items-center flex-1 justify-end">
          {menu?.map((item, idx) => (
            <div key={idx} className="relative menu-item group">
              <Link
                href={getLocalizedHref(item.href, locale)}
                target={item.target || "_self"}
                onClick={(e) => {
                  if (item.submenu?.length) {
                    e.preventDefault()
                    toggleMenu(idx)
                  }
                }}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-muted/50"
              >
                {item.label}
                {item.submenu?.length ? <span className="text-xs">▾</span> : null}
              </Link>

              {openMenu === idx && item.submenu?.length && (
                <div className="absolute left-0 top-full mt-1 bg-card shadow-xl rounded-lg border border-border/50 p-2 w-56 z-50">
                  <ul className="space-y-1 text-foreground">
                    {item.submenu.map((sub, sIdx) => (
                      <li key={sIdx} className="relative">
                        <Link
                          href={getLocalizedHref(sub.href, locale)}
                          target={sub.target || "_self"}
                          onClick={(e) => {
                            if (sub.childSubmenu?.length) {
                              e.preventDefault()
                              toggleSubmenu(sIdx)
                            }
                          }}
                          className="px-3 py-2 hover:bg-muted rounded-md flex justify-between items-center text-sm"
                        >
                          {sub.label}
                          {sub.childSubmenu?.length ? <span className="text-xs">▸</span> : null}
                        </Link>

                        {openSubmenu === sIdx && sub.childSubmenu?.length && (
                          <ul className="absolute left-full top-0 mt-0 ml-1 bg-card shadow-lg rounded-lg border border-border/50 p-2 w-52 z-50">
                            {sub.childSubmenu.map((child, cIdx) => (
                              <li key={cIdx}>
                                <Link
                                  href={getLocalizedHref(child.href, locale)}
                                  target={child.target || "_self"}
                                  className="block px-3 py-2 hover:bg-muted rounded-md text-sm"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA Button and Mobile Menu */}
        <div className="flex items-center gap-3">
          {ctaText && ctaLink && (
            <div className="hidden sm:block">
              <CalendorModal
                title={ctaText}
                src={ctaLink}
                buttonStyle="px-6 py-2 text-sm bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
              />
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-3">
            {menu?.map((item, idx) => (
              <div key={idx}>
                <Link
                  href={getLocalizedHref(item.href, locale)}
                  target={item.target || "_self"}
                  className="block px-4 py-2 text-foreground hover:text-primary rounded-md hover:bg-muted/50 transition-colors"
                >
                  {item.label}
                </Link>
              </div>
            ))}
            {ctaText && ctaLink && (
              <div className="pt-3 border-t border-border/50">
                <CalendorModal title={ctaText} src={ctaLink} buttonStyle="w-full px-4 py-2 text-sm justify-center" />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
