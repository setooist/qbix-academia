'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/strapi/auth';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { localeConfig } from '@/config/locale-config';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = params?.lang || 'en';
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const getLocalizedHref = (href: string) => {
    if (localeConfig.multilanguage.enabled) {
      return `/${lang}${href}`;
    }
    return href;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      const user = await refreshUser(); // Fetch and update user profile in context after login

      // Store role in local storage if available
      if (user?.role) {
        localStorage.setItem('user_role', user.role.type || user.role.name || 'authenticated');
      }

      toast({
        title: 'Success',
        description: 'You have been logged in successfully.',
      });

      // Check URL prefix based on config
      const urlPrefix = localeConfig.multilanguage.enabled ? `/${lang}` : '';
      const redirectUrl = searchParams.get('redirect');

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (user?.role?.name === 'Mentor' || user?.role?.type === 'mentor') {
        router.push(`${urlPrefix}/account/mentor`);
      } else {
        router.push(`${urlPrefix}/account/activities`);
      }

      router.refresh();
    } catch (error: any) {
      console.error('Login Error:', error);

      let errorMessage = error?.message || error?.error?.message || 'Failed to login. Please check your credentials.';
      let errorTitle = 'Login Failed';

      // Check for blocked/unapproved account
      if (
        errorMessage.toLowerCase().includes('blocked') ||
        errorMessage.toLowerCase().includes('confirmed') ||
        errorMessage.toLowerCase().includes('not confirmed') ||
        errorMessage.toLowerCase().includes('approval')
      ) {
        errorTitle = 'Account Pending Approval';
        errorMessage = 'Your account is pending admin approval. You will be notified via email once your account is approved.';
      } else if (errorMessage.toLowerCase().includes('invalid')) {
        errorMessage = 'Invalid email or password. Please try again.';
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
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
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </Button>

      {/* <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          New student?{' '}
          <Link
            href={getLocalizedHref('/auth/signup')}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div> */}
    </form>
  );
}
