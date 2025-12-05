"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FooterColumn, FooterAddress, FooterBottom } from "@/types/footer";
import { getFooter } from "../lib/footer";
import Image from "next/image";

const Footer = () => {
  const [columns, setColumns] = useState<FooterColumn[]>([]);
  const [address, setAddress] = useState<FooterAddress | null>(null);
  const [bottom, setBottom] = useState<FooterBottom | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await getFooter();

        if (data.columns) {
          setColumns(data.columns);
        } else {
          console.warn("No columns found in footer data");
        }

        if (data.address) {
          setAddress(data.address);
        } else {
          console.warn("No address found in footer data");
        }

        if (data.bottom) {
          setBottom(data.bottom);
        } else {
          console.warn("No bottom section found in footer data");
        }
      } catch (err) {
        console.error("Error fetching footer:", err);
      }
    };

    fetchFooter();
  }, []);
  const bottomLogoUrl = bottom?.logo?.url
    ? bottom.logo.url.startsWith("http")
      ? bottom.logo.url // already absolute
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${bottom.logo.url}` // local upload
    : "";


  return (
    <footer className="bg-linear-to-br from-[#5D491B] to-[#927949] text-white relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {columns.map((col, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-bold mb-6">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.type === "internal" ? (
                      <Link
                        href={link.url}
                        className="text-white/80 hover:text-white transition-colors duration-200 flex items-center"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors duration-200 flex items-center"
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
            <div>
              <h3 className="text-xl font-bold mb-6">{address.title}</h3>
              <p className="text-white/80 mb-2">{address.addressLines}</p>
              {address.phone && (
                <p className="text-white/80 mb-1">
                  Phone: <a href={`tel:${address.phone}`}>{address.phone}</a>
                </p>
              )}
              {address.email && (
                <p className="text-white/80 mb-1">
                  Email: <a href={`mailto:${address.email}`}>{address.email}</a>
                </p>
              )}
              {address.workingHours && (
                <p className="text-white/80 mb-1">Hours: {address.workingHours}</p>
              )}
              {address.mapLink && (
                <a
                  href={address.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white underline text-sm"
                >
                  View on Map
                </a>
              )}
            </div>
          )}
        </div>

        {bottom && (
          <div className="border-t border-white/20 pt-8 flex flex-col items-center md:flex-row md:justify-between">
            {bottomLogoUrl && (
              <a href={bottom.link || "/"}>
                <Image
                  src={bottomLogoUrl}
                  alt={bottom.altText || "Logo"}
                  width={100}
                  height={30}
                  objectFit="contain"
                  unoptimized
                />
              </a>
            )}

            <p className="text-sm text-white/75 text-center md:text-left">
              {bottom?.text}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
