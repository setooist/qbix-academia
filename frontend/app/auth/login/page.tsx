import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange/10 rounded-full blur-3xl"></div>
        <Card className="w-full max-w-md border-2 shadow-xl relative z-10">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4">
              <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#loginGrad)" opacity="0.1" />
                <circle cx="50" cy="35" r="15" fill="url(#loginGrad)" />
                <path d="M 20 70 Q 50 55 80 70 L 80 85 Q 50 70 20 85 Z" fill="url(#loginGrad)" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Log in to your QBIX Academia account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
