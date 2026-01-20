'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, User, LogOut, ChevronDown, Shield, BookOpen, Calendar, FileText, Users, Briefcase, Mail, Library, GraduationCap } from 'lucide-react';
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
import { NavigationData } from '@/lib/api/navigation';
import { GlobalData } from '@/lib/api/global';
import { getStrapiMedia } from '@/lib/strapi/client';
import { localeConfig } from '@/config/locale-config';

interface NavigationClientProps {
    readonly navData: NavigationData | null;
    readonly globalData: GlobalData | null;
    readonly lang: string;
}

const getLocalizedHref = (href: string, locale: string) => {
    if (localeConfig.multilanguage.enabled) {
        if (href.startsWith(`/${locale}`)) return href;
        const path = href.startsWith('/') ? href : `/${href}`;
        return `/${locale}${path}`;
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

export function NavigationClient({ navData, globalData, lang }: NavigationClientProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const [accountOpen, setAccountOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, profile, signOut } = useAuth();
    const { isStaff, isEventManager, isActivityManager, isStudent } = usePermissions();
    const router = useRouter();

    // Handle Scroll Effect
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
        // Initialize scroll state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (href: string) => pathname === href;

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const getLoginUrl = () => {
        if (!pathname || pathname.includes('/auth/login') || pathname.includes('/auth/signup')) {
            return getLocalizedHref('/auth/login', lang);
        }
        const currentSearch = searchParams?.toString();
        const fullPath = currentSearch ? `${pathname}?${currentSearch}` : pathname;
        return `${getLocalizedHref('/auth/login', lang)}?redirect=${encodeURIComponent(fullPath)}`;
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

    const menuItems = navData?.Menu || [];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-xl'
            : 'bg-white/80 backdrop-blur-md shadow-md'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
                    <Link href={getLocalizedHref('/', lang)} className="flex items-center space-x-3 group">
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
                            menuItems.map((item) => {
                                const hasSubmenu = item.submenu && item.submenu.length > 0;

                                if (hasSubmenu) {
                                    return (
                                        <DropdownMenu
                                            key={item.label}
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
                                                {item.submenu.map((subItem) => {
                                                    const Icon = getIconForLabel(subItem.label);
                                                    return (
                                                        <DropdownMenuItem key={subItem.href} asChild className="cursor-pointer rounded-lg p-3 focus:bg-primary/10">
                                                            <Link href={getLocalizedHref(subItem.href, lang)} prefetch={true} className="flex items-start gap-3">
                                                                <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
                                                                    <Icon className="w-4 h-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-gray-900">{subItem.label}</div>
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
                                        key={item.label}
                                        href={getLocalizedHref(item.href, lang)}
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
                                                {(profile?.fullName || profile?.username) ? getInitials(profile?.fullName || profile?.username) : <User className="w-5 h-5" />}
                                            </div>
                                            {isStaff && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                                                    <Shield className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                                {profile?.fullName || profile?.username || 'Account'}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 backdrop-blur-lg border-gray-200">
                                    <div className="px-3 py-2 mb-2">
                                        <p className="font-semibold text-gray-900">{profile?.fullName || profile?.username || 'User'}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    {isStaff && (
                                        <>
                                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2.5 focus:bg-primary/10">
                                                <Link href={getLocalizedHref('/admin', lang)} className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                                        <Shield className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium">Admin Panel</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    {isActivityManager() && (
                                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2.5 focus:bg-primary/10">
                                            <Link href={getLocalizedHref('/account/activity-management', lang)} className="flex items-center gap-3">
                                                <Users className="w-4 h-4 text-purple-600" />
                                                <span className="font-medium">Activity Management</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    {isEventManager() && (
                                        <>
                                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2.5 focus:bg-primary/10">
                                                <Link href={getLocalizedHref('/account/events', lang)} className="flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                    <span className="font-medium">Event Management</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    {accountNavItems
                                        .filter(item => {
                                            if (item.label === 'My Activities') {
                                                return isStudent();
                                            }
                                            return true;
                                        })
                                        .map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-lg p-2.5 focus:bg-primary/10">
                                                    <Link href={getLocalizedHref(item.href, lang)} className="flex items-center gap-3">
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
                            <Button asChild className="bg-gradient-to-r from-primary to-orange hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-medium">
                                <Link href={getLoginUrl()}>Log In</Link>
                            </Button>
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
                        {menuItems.map((item) => {
                            const hasSubmenu = item.submenu && item.submenu.length > 0;
                            const Icon = getIconForLabel(item.label);

                            if (hasSubmenu) {
                                const isOpen = openDropdowns[`mobile-${item.label}`];
                                return (
                                    <div key={item.label} className="space-y-2">
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
                                                {item.submenu.map((subItem) => {
                                                    const SubIcon = getIconForLabel(subItem.label);
                                                    return (
                                                        <Link
                                                            key={subItem.href}
                                                            href={getLocalizedHref(subItem.href, lang)}
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
                                    key={item.label}
                                    href={getLocalizedHref(item.href, lang)}
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
                                            {(profile?.fullName || profile?.username) ? getInitials(profile?.fullName || profile?.username) : <User className="w-6 h-6" />}
                                            {isStaff && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                                                    <Shield className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{profile?.fullName || profile?.username || 'User'}</p>
                                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {isStaff && (
                                    <Link
                                        href={getLocalizedHref('/admin', lang)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/20">
                                            <Shield className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-medium">Admin Panel</span>
                                    </Link>
                                )}

                                {isActivityManager() && (
                                    <Link
                                        href={getLocalizedHref('/account/activity-management', lang)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-purple-700 bg-purple-50 hover:bg-purple-100"
                                    >
                                        <Users className="w-5 h-5" />
                                        <span className="font-medium">Activity Management</span>
                                    </Link>
                                )}

                                {isEventManager() && (
                                    <Link
                                        href={getLocalizedHref('/admin/events', lang)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-orange-700 bg-orange-50 hover:bg-orange-100"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-medium">Event Management</span>
                                    </Link>
                                )}

                                {accountNavItems
                                    .filter(item => {
                                        if (item.label === 'My Activities') {
                                            return isStudent();
                                        }
                                        return true;
                                    })
                                    .map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={getLocalizedHref(item.href, lang)}
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
                                <Button asChild className="w-full bg-gradient-to-r from-primary to-orange hover:shadow-lg hover:shadow-primary/30 font-medium h-12">
                                    <Link href={getLoginUrl()} onClick={() => setMobileMenuOpen(false)}>
                                        Log In
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
