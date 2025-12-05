"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";
import { GlobalData } from "@/types/global";
import CalendorModal from "./CalendorModal";
import Image from "next/image";

interface HeaderProps {
  menu: MenuItem[];
  global?: GlobalData;
}

export default function Header({ menu, global }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const logoObj = global?.logo?.[0];
  const logoUrl = logoObj?.url
    ? logoObj.url.startsWith("http")
      ? logoObj.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${logoObj.url}`
    : "";
  const logoAlt = logoObj?.alternativeText || "Logo";

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
    setOpenMenu(prev => (prev === idx ? null : idx));
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (idx: number) => {
    setOpenSubmenu(prev => (prev === idx ? null : idx));
  };



  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <a href="/">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={logoObj?.alternativeText || "Logo"}
              width={120}
              height={40}
              objectFit="contain"
              unoptimized 
            />
          )}
        </a>

        {/* Navigation */}
        <nav className="flex gap-6 items-center">
          {menu?.map((item, idx) => (
            <div key={idx} className="relative menu-item">
              <a
                href={item.href}
                target={item.target || "_self"}
                onClick={e => {
                  if (item.submenu?.length) {
                    e.preventDefault();
                    toggleMenu(idx);
                  }
                }}
                className="flex items-center gap-1 text-lg text-gray-700 font-medium hover:text-blue-600 transition cursor-pointer"
              >
                {item.label}
                {item.submenu?.length ? <span className="ml-1">▾</span> : null}
              </a>

              {/* Submenu */}
              {openMenu === idx && item.submenu?.length && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-4 w-56 z-50">
                  <ul className="space-y-1 text-gray-700">
                    {item.submenu.map((sub, sIdx) => (
                      <li key={sIdx} className="relative group">
                        <a
                          href={sub.href}
                          target={sub.target || "_self"}
                          onClick={e => {
                            if (sub.childSubmenu?.length) {
                              e.preventDefault();
                              toggleSubmenu(sIdx);
                            }
                          }}
                          className="px-3 py-2 hover:bg-gray-100 rounded-md flex justify-between items-center"
                        >
                          {sub.label}
                          {sub.childSubmenu?.length ? <span className="ml-1">▸</span> : null}
                        </a>

                        {/* Child Submenu */}
                        {openSubmenu === sIdx && sub.childSubmenu?.length && (
                          <ul className="absolute left-full top-0 mt-0 ml-1 bg-white shadow-lg rounded-lg p-2 w-52 z-50">
                            {sub.childSubmenu.map((child, cIdx) => (
                              <li key={cIdx}>
                                <a
                                  href={child.href}
                                  target={child.target || "_self"}
                                  className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                                >
                                  {child.label}
                                </a>
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

        {/* CTA Button */}
        {ctaText && ctaLink && (
          <CalendorModal
            title={ctaText}
            src={ctaLink}
            buttonStyle="ml-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          />
        )}
      </div>
    </header>
  );
}
