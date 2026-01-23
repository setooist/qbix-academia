'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { updateProfile } from '@/lib/strapi/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { localeConfig } from '@/config/locale-config';

export function ChangePasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const params = useParams();
    const lang = params?.lang || 'en';
    const { toast } = useToast();
    const { user, refreshUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "New password and confirmation do not match.",
                variant: 'destructive',
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters long.",
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            if (!user?.id) throw new Error('User not found');

            // Force update password and reset flag
            // Note: Strapi usually handles password update via simple update if allowed
            await updateProfile(user.id, {
                password: password,
                resetPasswordOnNextLogin: false,
            } as any);

            await refreshUser();

            toast({
                title: 'Success',
                description: 'Password changed successfully.',
            });

            // Redirect to dashboard
            const urlPrefix = localeConfig.multilanguage.enabled ? `/${lang}` : '';
            if (user?.role?.name === 'Mentor' || user?.role?.type === 'mentor') {
                router.push(`${urlPrefix}/account/activity-management`);
            } else {
                router.push(`${urlPrefix}/account/activities`);
            }
        } catch (error: any) {
            console.error('Change password error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update password.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10 p-6 border rounded-md shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
                You must update your password to continue.
            </p>

            <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative mt-1">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                    <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pr-10"
                    />
                </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Updating...' : 'Set New Password'}
            </Button>
        </form>
    );
}
