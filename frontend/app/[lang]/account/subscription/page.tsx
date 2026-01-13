'use client';

import { Suspense, useState } from 'react';

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
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();

    // Check if user has active subscription
    const isPro = user?.tier === 'SUBSCRIPTION' || user?.subscriptionActive === true;

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
            setLoading(false);
        }
    };

    const handleCheckoutComplete = async () => {
        setLoading(false);
        setClientSecret(null); // Close the checkout modal/view

        // Refresh user data to get latest tier status
        await refreshUser();

        toast({
            title: "Success! ",
            description: "Your subscription is now active. Enjoy Pro features!",
            duration: 1000,
        });
    };

    if (clientSecret) {
        return (
            <div id="checkout" className="max-w-4xl mx-auto py-8">
                <Button variant="ghost" className="mb-4" onClick={() => { setClientSecret(null); setLoading(false); }}>
                    ← Back to Plans
                </Button>
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{
                        clientSecret,
                        onComplete: () => { handleCheckoutComplete(); }
                    }}
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
                {isPro && (
                    <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-4 py-1 mx-auto w-fit text-sm font-medium mt-4">
                        You are currently a Pro Member
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-8 justify-center">
                {/* Free Plan */}
                <Card className={isPro ? "" : "border-primary/20"}>
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
                        <Button variant="outline" className="w-full" disabled={!isPro} onClick={() => { }}>
                            {isPro ? "Downgrade" : "Current Plan"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className={`shadow-lg relative overflow-hidden ${isPro ? "border-green-500 ring-1 ring-green-500" : "border-primary"}`}>
                    <div className={`absolute top-0 right-0 ${isPro ? "bg-green-500" : "bg-primary"} text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg`}>
                        {isPro ? "Active" : "Recommended"}
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
                        {isPro ? (
                            <Button className="w-full bg-green-600 hover:bg-green-700 cursor-default" size="lg">
                                <Check className="mr-2 h-4 w-4" />
                                Active Plan
                            </Button>
                        ) : (
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
                        )}
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

