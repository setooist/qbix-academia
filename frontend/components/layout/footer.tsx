'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getFooter, FooterData } from '@/lib/api/footer';
import { getStrapiMedia } from '@/lib/strapi/client';

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    getFooter().then(data => {
      if (data) {
        setFooterData(data);
      }
    });
  }, []);

  const address = footerData?.Address;
  const columns = (footerData?.Column || []).filter(col => col.links && col.links.length > 0).slice(0, 2);
  const bottom = footerData?.Bottum[0];

  // Get logo from Strapi or use fallback
  const logoUrl = bottom?.logo && bottom.logo.length > 0
    ? getStrapiMedia(bottom.logo[0].url)
    : '/logo.png';
  const logoAlt = bottom?.logo && bottom.logo.length > 0
    ? (bottom.logo[0].alternativeText || bottom?.altText || 'QBIX Academia Logo')
    : 'QBIX Academia Logo';
  const isLocalLogo = logoUrl?.includes('localhost') || logoUrl?.includes('127.0.0.1');

  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href={bottom?.link || "/"} className="inline-block mb-4 group">
              <div className="transition-transform duration-300 group-hover:scale-105 backdrop-blur-sm rounded-lg p-3">
                <Image
                  src={logoUrl || '/logo.png'}
                  alt={logoAlt}
                  width={200}
                  height={55}
                  unoptimized={isLocalLogo}
                  className="drop-shadow-xl"
                />
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {/* Static fallback description or could be fetched if added to schema */}
              Your trusted partner in international education. We guide students towards their dream of studying abroad.
            </p>
            <div className="flex space-x-4">
              {/* Socials - keeping static as per common pattern unless schema has specific social block */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Dynamic Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-lg font-semibold mb-4">{col.title}</h3>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={`${link.label}-${link.url}`}>
                    {link.type === 'internal' ? (
                      <Link href={link.url} className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Fallback if no columns loaded yet (optional skeleton) */}
          {columns.length === 0 && (
            <>
              <div className="animate-pulse space-y-3">
                <div className="h-6 w-32 bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
              </div>
              <div className="animate-pulse space-y-3">
                <div className="h-6 w-32 bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
              </div>
            </>
          )}

          <div className="lg:col-start-4">
            <h3 className="text-lg font-semibold mb-4">{address?.title || "Contact Us"}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start group">
                <Mail className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <a href={`mailto:${address?.email || 'info@qbixacademia.com'}`} className="text-gray-300 hover:text-primary transition-colors">
                  {address?.email || 'info@qbixacademia.com'}
                </a>
              </li>
              <li className="flex items-start group">
                <Phone className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <a href={`tel:${(address?.phone || '+91 1234567890').replaceAll(/\s/g, '')}`} className="text-gray-300 hover:text-primary transition-colors">
                  {address?.phone || '+91 1234567890'}
                </a>
              </li>
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-300 whitespace-pre-line">
                  {address?.addressLines || 'Office 123, Learning Hub,\nKnowledge City, Pune - 411001'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; {currentYear} {bottom?.text || "QBIX Academia"}. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}