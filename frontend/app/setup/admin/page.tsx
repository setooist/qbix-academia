'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminSetupPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePromoteToAdmin = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to become an admin' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.rpc('promote_to_admin', {
        user_id: user.id
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: 'success',
        text: 'Successfully promoted to Admin! Redirecting...'
      });

      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    } catch (error: any) {
      console.error('Error promoting to admin:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to promote to admin. You may not have permission, or an admin already exists.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Login Required
            </CardTitle>
            <CardDescription>
              You must be logged in to set up an admin account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Admin Setup</CardTitle>
          <CardDescription className="text-center">
            Become the first administrator of this system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-2">Current Account:</p>
            <p className="mb-1"><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {(profile?.role as any)?.name || 'Student'}</p>
          </div>

          {message && (
            <div className={`rounded-lg p-4 flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <div className="space-y-3 text-sm text-gray-600">
            <p>
              By clicking the button below, you will be promoted to Administrator.
              This action is only available when no admins exist in the system.
            </p>
            <p className="font-medium">As an admin, you will be able to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Manage users and roles</li>
              <li>Create and publish content</li>
              <li>Manage events and activities</li>
              <li>Configure system settings</li>
            </ul>
          </div>

          <Button
            onClick={handlePromoteToAdmin}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Setting up...' : 'Become Administrator'}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
