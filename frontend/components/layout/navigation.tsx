'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, ChevronDown, Shield, BookOpen, Calendar, FileText, Users, Home, Briefcase, Mail, Library, GraduationCap, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getNavigation, NavigationData, MenuItem } from '@/lib/api/navigation';
import { getGlobal, GlobalData } from '@/lib/api/global';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useParams } from 'next/navigation';
import { localeConfig } from '@/config/locale-config';

const getLocalizedHref = (href: string, locale: string) => {
  if (localeConfig.multilanguage.enabled) {
    return `/${locale}${href}`;
  }
  return href;
};

const getIconForLabel = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('about')) return Users;
  if (l.includes('community')) return Users;
  if (l.includes('pre-departure')) return BookOpen;
  if (l.includes('event')) return Calendar;
  if (l.includes('blog')) return FileText;
  if (l.includes('case')) return Briefcase;
  if (l.includes('download')) return Library;
  if (l.includes('team')) return GraduationCap;
  if (l.includes('contact')) return Mail;
  if (l.includes('service')) return Briefcase;
  return BookOpen;
};

const accountNavItems = [
  { label: 'My Profile', href: '/account/profile', icon: User },
  { label: 'My Library', href: '/account/library', icon: Library },
  { label: 'My Activities', href: '/account/activities', icon: Calendar },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navData, setNavData] = useState<NavigationData | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [accountOpen, setAccountOpen] = useState(false);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.lang as string) || 'en';
  const { user, profile, signOut } = useAuth();
  const { isStaff } = usePermissions();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        setScrolled(true);
      } else if (currentScroll <= 10) {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    getNavigation(locale).then(data => {
      if (data) {
        setNavData(data);
      }
    });

    getGlobal(locale).then(data => {
      if (data) {
        setGlobalData(data);
      }
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleDropdown = (label: string, isOpen: boolean) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: isOpen }));
  };

  // Default static items if api fails or loading (optional fallback, currently empty array or skeleton could be better)
  const menuItems = navData?.Menu || [];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-white/95 backdrop-blur-lg shadow-xl'
      : 'bg-white/80 backdrop-blur-md shadow-md'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          <Link href={getLocalizedHref('/', locale)} className="flex items-center space-x-3 group">
            <div className="relative transition-all duration-300 group-hover:scale-105">
              <Image
                src={(globalData?.logo?.[0]?.url) ? getStrapiMedia(globalData.logo[0].url) || "/Logo.png" : "/Logo.png"}
                alt={globalData?.siteName || "QBIX Academia Logo"}
                width={scrolled ? 140 : 170}
                height={scrolled ? 38 : 46}
                className="transition-all duration-300 drop-shadow-md"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.length > 0 ? (
              menuItems.map((item, index) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;

                if (hasSubmenu) {
                  return (
                    <DropdownMenu
                      key={index}
                      open={openDropdowns[item.label] || false}
                      onOpenChange={(open) => toggleDropdown(item.label, open)}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`relative px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-300 flex items-center gap-1.5 ${item.submenu.some(sub => isActive(sub.href))
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                            } group`}
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdowns[item.label] ? 'rotate-180' : ''}`} />
                          <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange rounded-full transition-all duration-300 ${item.submenu.some(sub => isActive(sub.href)) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                            }`}></span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-72 p-2 bg-white/95 backdrop-blur-lg border-gray-200">
                        {item.submenu.map((subItem, subIndex) => {
                          const Icon = getIconForLabel(subItem.label);
                          return (
                            <DropdownMenuItem key={subIndex} asChild className="cursor-pointer rounded-lg p-3 focus:bg-primary/10">
                              <Link href={getLocalizedHref(subItem.href, locale)} prefetch={true} className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
                                  <Icon className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{subItem.label}</div>
                                  {/* Description could be added here if available in subItem */}
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <Link
                    key={index}
                    href={getLocalizedHref(item.href, locale)}
                    prefetch={true}
                    className={`relative px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-300 ${isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                      } group`}
                  >
                    {item.label}
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange rounded-full transition-all duration-300 ${isActive(item.href) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                      }`}></span>
                  </Link>
                );
              })
            ) : (
              // Fallback static or loading state could go here
              <div className="animate-pulse flex space-x-4">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 group">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        {profile?.full_name ? getInitials(profile.full_name) : <User className="w-5 h-5" />}
                      </div>
                      {isStaff && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                        {profile?.full_name || 'Account'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 backdrop-blur-lg border-gray-200">
                  <div className="px-3 py-2 mb-2">
                    <p className="font-semibold text-gray-900">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isStaff && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2.5 focus:bg-primary/10">
                        <Link href={getLocalizedHref('/admin', locale)} className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <Shield className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {accountNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-lg p-2.5 focus:bg-primary/10">
                        <Link href={getLocalizedHref(item.href, locale)} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded-lg p-2.5 text-red-600 focus:bg-red-50 focus:text-red-700">
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-700 hover:text-primary hover:bg-gray-100 transition-all duration-300 font-medium">
                  <Link href={getLocalizedHref('/auth/login', locale)}>Log In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-orange hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-medium">
                  <Link href={getLocalizedHref('/auth/signup', locale)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {menuItems.map((item, index) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const Icon = getIconForLabel(item.label);

              if (hasSubmenu) {
                const isOpen = openDropdowns[`mobile-${item.label}`];
                return (
                  <div key={index} className="space-y-2">
                    <button
                      onClick={() => toggleDropdown(`mobile-${item.label}`, !isOpen)}
                      className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="ml-4 space-y-1">
                        {item.submenu.map((subItem, subIndex) => {
                          const SubIcon = getIconForLabel(subItem.label);
                          return (
                            <Link
                              key={subIndex}
                              href={getLocalizedHref(subItem.href, locale)}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                toggleDropdown(`mobile-${item.label}`, false);
                              }}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${isActive(subItem.href)
                                ? 'text-primary bg-primary/10'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={getLocalizedHref(item.href, locale)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${isActive(item.href)
                    ? 'text-primary bg-primary/10 border-l-4 border-primary'
                    : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {user && (
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="px-4 py-3 bg-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange flex items-center justify-center text-white font-semibold shadow-lg relative">
                      {profile?.full_name ? getInitials(profile.full_name) : <User className="w-6 h-6" />}
                      {isStaff && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {isStaff && (
                  <Link
                    href={getLocalizedHref('/admin', locale)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                )}

                {accountNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={getLocalizedHref(item.href, locale)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.href)
                        ? 'text-primary bg-primary/10 border-l-4 border-primary'
                        : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 border-l-4 border-transparent hover:border-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}

            {!user && (
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-3">
                <Button asChild variant="ghost" className="w-full justify-center text-gray-700 hover:text-primary hover:bg-gray-100 font-medium h-12">
                  <Link href={getLocalizedHref('/auth/login', locale)} onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-primary to-orange hover:shadow-lg hover:shadow-primary/30 font-medium h-12">
                  <Link href={getLocalizedHref('/auth/signup', locale)} onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}