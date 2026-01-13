import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <Card className="w-full max-w-md border-2 shadow-xl relative z-10">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4">
              <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="signupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#signupGrad)" opacity="0.1" />
                <path d="M 50 20 L 55 35 L 70 35 L 58 45 L 63 60 L 50 50 L 37 60 L 42 45 L 30 35 L 45 35 Z" fill="url(#signupGrad)" />
                <circle cx="50" cy="70" r="8" fill="url(#signupGrad)" opacity="0.6" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join QBIX Academia and start your study abroad journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
