'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/contexts/auth-context';
import { updateProfile } from '@/lib/strapi/auth';
import { Loader2 } from 'lucide-react';

const userProfileSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name is required.' }),
    email: z.string().email(),
    phone: z.string().optional(),
    bio: z.string().optional(),
});

type UserProfileValues = z.infer<typeof userProfileSchema>;

export function UserProfileForm() {
    const { toast } = useToast();
    const { user, refreshUser, loading: authLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UserProfileValues>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
        },
    });

    // Update form default values when user data loads
    if (user && !form.formState.isDirty) {
        if (user.fullName !== form.getValues().fullName) form.setValue('fullName', user.fullName || '');
        if (user.email !== form.getValues().email) form.setValue('email', user.email || '');
        if (user.phone !== form.getValues().phone) form.setValue('phone', user.phone || '');
        if (user.bio !== form.getValues().bio) form.setValue('bio', user.bio || '');
    }

    async function onSubmit(data: UserProfileValues) {
        if (!user?.id) return;

        setIsSubmitting(true);
        try {
            await updateProfile(user.id, {
                fullName: data.fullName,
                phone: data.phone,
                bio: data.bio,
            });

            await refreshUser();

            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled className="bg-muted" />
                                    </FormControl>
                                    <FormDescription>
                                        Email cannot be changed directly.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 234 567 890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
