'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, ChevronDown, Shield, BookOpen, Calendar, FileText, Users, Home, Briefcase, Mail, Library, GraduationCap } from 'lucide-react';
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
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const aboutNavItems = [
  { label: 'About Us', href: '/about', icon: Users, description: 'Learn about our mission' },
  { label: 'Our Team', href: '/team', icon: GraduationCap, description: 'Meet our experts' },
];

const resourcesNavItems = [
  { label: 'Community', href: '/community', icon: Users, description: 'Join our community' },
  { label: 'Pre-Departure', href: '/pre-departure', icon: BookOpen, description: 'Prepare for your journey' },
  { label: 'Events', href: '/events', icon: Calendar, description: 'Upcoming events' },
  { label: 'Blogs', href: '/blogs', icon: FileText, description: 'Latest insights' },
  { label: 'Case Studies', href: '/case-studies', icon: Briefcase, description: 'Success stories' },
  { label: 'Downloadables', href: '/downloadables', icon: Library, description: 'Resources & guides' },
];

const accountNavItems = [
  { label: 'My Profile', href: '/account/profile', icon: User },
  { label: 'My Library', href: '/account/library', icon: Library },
  { label: 'My Activities', href: '/account/activities', icon: Calendar },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const { isStaff } = usePermissions();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
      ? 'bg-white/95 backdrop-blur-lg shadow-xl'
      : 'bg-white/80 backdrop-blur-md shadow-md'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative transition-all duration-500 group-hover:scale-105">
              <Image
                src="/logo-transparent copy.png"
                alt="QBIX Academia Logo"
                width={scrolled ? 140 : 170}
                height={scrolled ? 38 : 46}
                className="transition-all duration-500 drop-shadow-md"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              prefetch={true}
              className={`relative px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-300 ${isActive('/')
                ? 'text-primary bg-primary/10'
                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                } group`}
            >
              Home
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange rounded-full transition-all duration-300 ${isActive('/') ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                }`}></span>
            </Link>

            <DropdownMenu open={aboutOpen} onOpenChange={setAboutOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-300 flex items-center gap-1.5 ${aboutNavItems.some(item => isActive(item.href))
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                    } group`}
                >
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${aboutOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange rounded-full transition-all duration-300 ${aboutNavItems.some(item => isActive(item.href)) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                    }`}></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 p-2 bg-white/95 backdrop-blur-lg border-gray-200">
                {aboutNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-lg p-3 focus:bg-primary/10">
                      <Link href={item.href} prefetch={true} className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/services"
              prefetch={true}
              className={`relative px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-300 ${isActive('/services')
                ? 'text-primary bg-primary/10'
                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                } group`}
            >
              Services
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange rounded-full transition-all duration-300 ${isActive('/services') ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                }`}></span>
            </Link>

            <DropdownMenu open={resourcesOpen} onOpenChange={setResourcesOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-300 flex items-center gap-1.5 ${resourcesNavItems.some(item => isActive(item.href))
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                    } group`}
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${resourcesOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange rounded-full transition-all duration-300 ${resourcesNavItems.some(item => isActive(item.href)) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                    }`}></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2 bg-white/95 backdrop-blur-lg border-gray-200">
                <div className="grid gap-1">
                  {resourcesNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-lg p-3 focus:bg-primary/10">
                        <Link href={item.href} prefetch={true} className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/contact"
              prefetch={true}
              className={`relative px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-300 ${isActive('/contact')
                ? 'text-primary bg-primary/10'
                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                } group`}
            >
              Contact
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange rounded-full transition-all duration-300 ${isActive('/contact') ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                }`}></span>
            </Link>
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
                        <Link href="/admin" className="flex items-center gap-3">
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
                        <Link href={item.href} className="flex items-center gap-3">
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
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-orange hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-medium">
                  <Link href="/auth/signup">Sign Up</Link>
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

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${isActive('/')
                ? 'text-primary bg-primary/10 border-l-4 border-primary'
                : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <div className="space-y-2">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>About</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutOpen && (
                <div className="ml-4 space-y-1">
                  {aboutNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setAboutOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${isActive(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${isActive('/services')
                ? 'text-primary bg-primary/10 border-l-4 border-primary'
                : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Services</span>
            </Link>

            <div className="space-y-2">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Library className="w-5 h-5" />
                  <span>Resources</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesOpen && (
                <div className="ml-4 space-y-1">
                  {resourcesNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setResourcesOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${isActive(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${isActive('/contact')
                ? 'text-primary bg-primary/10 border-l-4 border-primary'
                : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                }`}
            >
              <Mail className="w-5 h-5" />
              <span>Contact</span>
            </Link>

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
                    href="/admin"
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
                      href={item.href}
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
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-primary to-orange hover:shadow-lg hover:shadow-primary/30 font-medium h-12">
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
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