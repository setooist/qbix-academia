import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4 group">
              <div className="transition-transform duration-300 group-hover:scale-105 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Image
                  src="/logo-transparent copy.png"
                  alt="QBIX Academia Logo"
                  width={200}
                  height={55}
                  className="drop-shadow-xl"
                />
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Your trusted partner in international education. We guide students towards their dream of studying abroad.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/community" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/pre-departure" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Pre-Departure
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/downloadables" className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Downloadables
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start group">
                <Mail className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <a href="mailto:info@qbixacademia.com" className="text-gray-300 hover:text-primary transition-colors">
                  info@qbixacademia.com
                </a>
              </li>
              <li className="flex items-start group">
                <Phone className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <a href="tel:+919764277042" className="text-gray-300 hover:text-primary transition-colors">
                  +91 97642 77042
                </a>
              </li>
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-300">
                  302 59B, C Ln, Ragvilas Society<br />
                  Koregaon Park, Pune<br />
                  Maharashtra 411001, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; {currentYear} QBIX Academia. All rights reserved.</p>
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