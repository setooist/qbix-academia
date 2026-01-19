'use client';

import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { localeConfig } from '@/config/locale-config';
import {
    Activity,
    GraduationCap,
    BookOpen,
    User,
    LayoutDashboard,
    CreditCard,
    Calendar
} from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const params = useParams();
    const lang = params?.lang || 'en';
    const { user } = useAuth();
    const { isActivityManager, isEventManager, isStudent } = usePermissions();

    // Helper to get localized href
    const getHref = (path: string) => {
        if (localeConfig.multilanguage.enabled) {
            return `/${lang}${path}`;
        }
        return path;
    };

    const navItems = [
        ...(isStudent() ? [{
            href: getHref('/account/activities'),
            label: 'My Activities',
            icon: Activity,
            description: 'View your assigned tasks'
        }] : []),
        // Only show Activity Management if user is an activity manager
        ...(isActivityManager() ? [{
            href: getHref('/account/activity-management'),
            label: 'Activity Management',
            icon: GraduationCap,
            description: 'Review student submissions'
        }] : []),
        // Only show Event Management if user is an event manager
        ...(isEventManager() ? [{
            href: getHref('/account/events'),
            label: 'Event Management',
            icon: Calendar,
            description: 'Manage events and registrations'
        }] : []),
        {
            href: getHref('/account/library'),
            label: 'My Library',
            icon: BookOpen,
            description: 'Saved resources'
        },
        ...(isStudent() ? [{
            href: getHref('/account/subscription'),
            label: 'Subscription',
            icon: CreditCard,
            description: 'Manage your plan'
        }] : []),
        {
            href: getHref('/account/profile'),
            label: 'Profile',
            icon: User,
            description: 'Account settings'
        },
    ];

    const isActive = (href: string) => pathname.startsWith(href);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Account Navigation */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-gray-900"> {user?.fullName}</span>
                        </div>
                    </div>
                    <nav className="flex gap-1 overflow-x-auto pb-px">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                                        border-b-2 transition-colors
                                        ${active
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}
