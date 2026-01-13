'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '@/lib/api/subscription';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/contexts/auth-context';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

// Make sure to set this public key in your frontend .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function SubscriptionContent() {
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (searchParams.get('session_id')) {
            toast({
                title: "Subscription status updated",
                description: "Please check your account status.",
            });
            // Cleanup URL
            router.replace('/account/subscription');
        }
    }, [searchParams, router, toast]);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const data = await createCheckoutSession();
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                throw new Error('No client secret received');
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || 'Failed to start subscription',
                variant: "destructive",
            });
            setLoading(false); // Only toggle off if we failed. If success, we show checkout.
        }
    };

    if (clientSecret) {
        return (
            <div id="checkout" className="max-w-4xl mx-auto py-8">
                <Button variant="ghost" className="mb-4" onClick={() => { setClientSecret(null); setLoading(false); }}>
                    ← Back to Plans
                </Button>
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                >
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Upgrade your Plan</h1>
                <p className="text-muted-foreground">Unlock access to all features and content.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-8 justify-center">
                {/* Free Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Free</CardTitle>
                        <CardDescription>Essential access only</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Basic content access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Community forum</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="border-primary shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                        Recommended
                    </div>
                    <CardHeader>
                        <CardTitle>Pro Membership</CardTitle>
                        <CardDescription>Everything needed to master your skills</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">$10<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                        <div className="space-y-2">
                            {[
                                'Unlimited course access',
                                'Premium mentorship',
                                'Certificate of completion',
                                'Priority support',
                                'Exclusive webinars'
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleSubscribe}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Subscribe Now
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SubscriptionContent />
        </Suspense>
    );
}

