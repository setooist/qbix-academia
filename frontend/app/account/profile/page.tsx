'use client';

import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <section className="py-20 flex-grow bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">My Profile</h1>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription className="text-base">
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    defaultValue={profile?.full_name || ''}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={profile?.phone || ''}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  defaultValue={profile?.bio || ''}
                  placeholder="Tell us about yourself..."
                  className="mt-1"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <Button className="transition-all duration-300 hover:shadow-lg">Save Changes</Button>
                <Button variant="outline" className="transition-all duration-300 hover:shadow-lg">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
