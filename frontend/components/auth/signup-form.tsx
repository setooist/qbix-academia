'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { signUp } from '@/lib/strapi/auth';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle2, Clock, Mail } from 'lucide-react';
import { localeConfig } from '@/config/locale-config';

export function SignupForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const params = useParams();
  const lang = params?.lang || 'en';

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
      await signUp(email, password, fullName, phone);
      setSignupSuccess(true);
      toast({
        title: 'Registration Submitted',
        description: 'Your account request has been submitted for approval.',
      });
    } catch (error: any) {
      console.error('Signup Error:', error);

      let errorMessage = error?.message || error?.error?.message || 'Failed to sign up. Please try again.';

      if (
        errorMessage.includes('500') ||
        errorMessage.toLowerCase().includes('internal server error') ||
        errorMessage.toLowerCase().includes('internalservererror')
      ) {
        errorMessage = 'Registration failed. This email address is likely already registered.';
      } else if (errorMessage.toLowerCase().includes('taken') || errorMessage.toLowerCase().includes('exists')) {
        errorMessage = 'This email address is already registered. Please log in instead.';
      } else if (errorMessage.toLowerCase().includes('password')) {
        errorMessage = 'Password is too weak. It must be at least 6 characters.';
      } else if (errorMessage.toLowerCase().includes('forbidden')) {
        errorMessage = 'Unable to create account. Please try again later or contact support.';
      }

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Success state - show approval pending message
  if (signupSuccess) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Registration Submitted!</h3>
          <p className="text-gray-600">
            Thank you for registering, <span className="font-medium">{fullName}</span>!
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Pending Approval</p>
              <p className="text-sm text-amber-700">
                Your account is currently pending admin approval. You will be notified once your account is approved.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-700">
                We'll send a confirmation email to <span className="font-medium">{email}</span> once approved.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Link href={getLocalizedHref('/auth/login')}>
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="mt-1"
        />
      </div>
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
            minLength={6}
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
        {loading ? 'Submitting...' : 'Submit Registration'}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-2">
        By registering, your account will be reviewed by our team before approval.
      </p>
    </form>
  );
}
