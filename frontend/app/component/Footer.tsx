"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FooterColumn, FooterAddress, FooterBottom } from "@/types/footer";
import { getFooter } from "../lib/footer";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const [columns, setColumns] = useState<FooterColumn[]>([]);
  const [address, setAddress] = useState<FooterAddress | null>(null);
  const [bottom, setBottom] = useState<FooterBottom | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await getFooter();
        if (data.columns) setColumns(data.columns);
        if (data.address) setAddress(data.address);
        if (data.bottom) setBottom(data.bottom);
      } catch (err) {
        console.error("Error fetching footer:", err);
      }
    };
    fetchFooter();
  }, []);

  const bottomLogoUrl = bottom?.logo?.url
    ? bottom.logo.url.startsWith("http")
      ? bottom.logo.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${bottom.logo.url}`
    : "";

  return (
    <footer className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.type === "internal" ? (
                      <Link
                        href={link.url}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center text-sm"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {address && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{address.title}</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <span>{address.addressLines}</span>
                </div>
                {address.phone && (
                  <a
                    href={`tel:${address.phone}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    {address.phone}
                  </a>
                )}
                {address.email && (
                  <a
                    href={`mailto:${address.email}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    {address.email}
                  </a>
                )}
                {address.workingHours && (
                  <div className="text-xs text-muted-foreground">Hours: {address.workingHours}</div>
                )}
                {address.mapLink && (
                  <a
                    href={address.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    View on Map
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom section */}
        {bottom && (
          <div className="border-t border-border/50 pt-8 flex flex-col items-center md:flex-row md:justify-between gap-6">
            {bottomLogoUrl && (
              <a href={bottom.link || "/"} className="flex-shrink-0">
                <Image
                  src={bottomLogoUrl || "/placeholder.svg"}
                  alt={bottom.altText || "Logo"}
                  width={120}
                  height={30}
                  objectFit="contain"
                  unoptimized
                />
              </a>
            )}
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">{bottom?.text}</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
