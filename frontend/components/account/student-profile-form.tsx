'use client';

import { useState, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { useAuth } from '@/lib/contexts/auth-context';
import {
    getStudentProfileByUser,
    createStudentProfileREST,
    updateStudentProfileREST,
    StudentProfile,
    StudentProfileInput,
} from '@/lib/api/student-profile';

// --- Validation Schema ---

const academicRowSchema = z.object({
    qualification: z.string(),
    awardingBody: z.string().optional(),
    subject: z.string().optional(),
    fromTo: z.string().optional(),
    results: z.string().optional(),
});

const courseChoiceSchema = z.object({
    country: z.string().optional(),
    startDateMonth: z.string().optional(),
    startDateYear: z.string().optional(),
});

const entranceExamSchema = z.object({
    ieltsToefl: z.boolean().default(false),
    ieltsToeflTaken: z.string().optional(),
    ieltsToeflReading: z.boolean().default(false),
    ieltsToeflWriting: z.boolean().default(false),
    ieltsToeflListening: z.boolean().default(false),
    ieltsToeflSpeaking: z.boolean().default(false),
    ieltsToeflOverall: z.boolean().default(false),

    greGmat: z.boolean().default(false),
    greGmatTaken: z.string().optional(),
    greGmatQuant: z.boolean().default(false),
    greGmatVerbal: z.boolean().default(false),
    greGmatAwa: z.boolean().default(false),

    other: z.boolean().default(false),
    otherName: z.string().optional(),
    otherTaken: z.string().optional(),
    otherScore: z.string().optional(),
});

const studentProfileSchema = z.object({
    // 1. Personal Details
    fullName: z.string().min(2, { message: 'Full name is required.' }),
    dob: z.date({ required_error: 'Date of birth is required.' }),
    gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required.' }),
    address: z.string().min(5, { message: 'Address is required.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    mobile: z.string().min(10, { message: 'Valid mobile number is required.' }),

    // 2. Academic Qualification
    academics: z.array(academicRowSchema),

    // 3. Courses Applied For
    firstChoice: courseChoiceSchema,
    secondChoice: courseChoiceSchema,

    // 4. Entrance Exams
    entranceExams: entranceExamSchema,

    // Declaration
    declarationConfirmed: z.boolean().refine((val) => val === true, {
        message: 'You must confirm the declaration.',
    }),
    declarationSigned: z.string().min(2, { message: 'Signature is required.' }),
    declarationDate: z.date({ required_error: 'Declaration date is required.' }),
});

type StudentProfileValues = z.infer<typeof studentProfileSchema>;

const defaultAcademics = [
    { qualification: '10th', awardingBody: '', subject: '', fromTo: '', results: '' },
    { qualification: '12th / Diploma', awardingBody: '', subject: '', fromTo: '', results: '' },
    { qualification: 'Bachelor', awardingBody: '', subject: '', fromTo: '', results: '' },
    { qualification: 'Master', awardingBody: '', subject: '', fromTo: '', results: '' },
];

export function StudentProfileForm() {
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();

    // State for tracking existing profile and loading
    const [existingProfile, setExistingProfile] = useState<StudentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<StudentProfileValues>({
        resolver: zodResolver(studentProfileSchema),
        defaultValues: {
            fullName: '',
            address: '',
            email: '',
            mobile: '',
            academics: defaultAcademics,
            firstChoice: {},
            secondChoice: {},
            entranceExams: {
                ieltsToefl: false,
                ieltsToeflReading: false,
                ieltsToeflWriting: false,
                ieltsToeflListening: false,
                ieltsToeflSpeaking: false,
                ieltsToeflOverall: false,
                greGmat: false,
                greGmatQuant: false,
                greGmatVerbal: false,
                greGmatAwa: false,
                other: false,
            },
            declarationConfirmed: false,
            declarationSigned: '',
        },
    });

    // Fetch existing profile on mount
    useEffect(() => {
        async function fetchProfile() {
            if (!user?.documentId) {
                setIsLoading(false);
                return;
            }

            try {
                const profile = await getStudentProfileByUser(user.documentId);
                if (profile) {
                    setExistingProfile(profile);
                    // Reset form with existing profile data
                    form.reset({
                        fullName: profile.fullName || user?.fullName || '',
                        dob: profile.dob ? new Date(profile.dob) : undefined,
                        gender: profile.gender,
                        address: profile.address || '',
                        email: profile.email || user?.email || '',
                        mobile: profile.mobile || '',
                        academics: profile.academics?.length ? profile.academics : defaultAcademics,
                        firstChoice: profile.firstChoice || {},
                        secondChoice: profile.secondChoice || {},
                        entranceExams: profile.entranceExams || {
                            ieltsToefl: false,
                            ieltsToeflReading: false,
                            ieltsToeflWriting: false,
                            ieltsToeflListening: false,
                            ieltsToeflSpeaking: false,
                            ieltsToeflOverall: false,
                            greGmat: false,
                            greGmatQuant: false,
                            greGmatVerbal: false,
                            greGmatAwa: false,
                            other: false,
                        },
                        declarationConfirmed: profile.declarationConfirmed || false,
                        declarationSigned: profile.declarationSigned || '',
                        declarationDate: profile.declarationDate ? new Date(profile.declarationDate) : undefined,
                    });
                } else {
                    // No existing profile, pre-fill from user data
                    form.reset({
                        ...form.getValues(),
                        fullName: user?.fullName || '',
                        email: user?.email || '',
                        mobile: user?.phone || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching student profile:', error);
                toast({
                    title: "Error",
                    description: "Failed to load existing profile data.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        if (!authLoading) {
            fetchProfile();
        }
    }, [user, authLoading, form, toast]);

    async function onSubmit(data: StudentProfileValues) {
        if (!user?.documentId) {
            toast({
                title: "Error",
                description: "You must be logged in to submit a profile.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Transform form data to API format
            const profileData: StudentProfileInput = {
                fullName: data.fullName,
                dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : undefined,
                gender: data.gender,
                address: data.address,
                email: data.email,
                mobile: data.mobile,
                academics: data.academics,
                firstChoice: data.firstChoice,
                secondChoice: data.secondChoice,
                entranceExams: data.entranceExams,
                declarationConfirmed: data.declarationConfirmed,
                declarationSigned: data.declarationSigned,
                declarationDate: data.declarationDate ? format(data.declarationDate, 'yyyy-MM-dd') : undefined,
                user: user.documentId,
            };

            let result;
            if (existingProfile?.documentId) {
                // Update existing profile
                result = await updateStudentProfileREST(existingProfile.documentId, profileData);
                toast({
                    title: "Profile Updated",
                    description: "Your student profile has been updated successfully.",
                    duration: 5000,
                });
            } else {
                // Create new profile
                result = await createStudentProfileREST(profileData);
                setExistingProfile(result);
                toast({
                    title: "Profile Created",
                    description: "Your student profile has been created successfully.",
                    duration: 5000,
                });
            }

            console.log('Saved Profile:', result);
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to save profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Show loading state while fetching profile
    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading profile...</span>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* 1. Personal Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
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
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="male" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Male</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="female" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Female</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="other" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Other</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="123 Main St..." {...field} />
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
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 234 567 890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* 2. Academic Qualification */}
                <Card>
                    <CardHeader>
                        <CardTitle>2. Academic Qualification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Qualification</TableHead>
                                    <TableHead>Awarding Body</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>From - To</TableHead>
                                    <TableHead>Results Achieved</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {defaultAcademics.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {row.qualification}
                                            {/* Hidden input to keep track of qualification name in form state if needed, 
                             though we initialized with defaultAcademics, mapped fields need care. 
                             React Hook Form handles arrays with useFieldArray best, but for static rows simple mapping works if indices match. */}
                                            <input type="hidden" {...form.register(`academics.${index}.qualification`)} value={row.qualification} />
                                        </TableCell>
                                        <TableCell>
                                            <Input {...form.register(`academics.${index}.awardingBody`)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input {...form.register(`academics.${index}.subject`)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input {...form.register(`academics.${index}.fromTo`)} placeholder="YYYY-YYYY" />
                                        </TableCell>
                                        <TableCell>
                                            <Input {...form.register(`academics.${index}.results`)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* 3. Course(s) Applied For */}
                <Card>
                    <CardHeader>
                        <CardTitle>3. Course(s) Applied For</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        {/* First Choice */}
                        <div className="space-y-4 border p-4 rounded-md">
                            <h4 className="font-semibold">First Choice</h4>
                            <FormField
                                control={form.control}
                                name="firstChoice.country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. USA" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstChoice.startDateMonth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Month</FormLabel>
                                            <FormControl>
                                                <Input placeholder="MM" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstChoice.startDateYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Year</FormLabel>
                                            <FormControl>
                                                <Input placeholder="YYYY" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Second Choice */}
                        <div className="space-y-4 border p-4 rounded-md">
                            <h4 className="font-semibold">Second Choice</h4>
                            <FormField
                                control={form.control}
                                name="secondChoice.country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. UK" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="secondChoice.startDateMonth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Month</FormLabel>
                                            <FormControl>
                                                <Input placeholder="MM" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="secondChoice.startDateYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Year</FormLabel>
                                            <FormControl>
                                                <Input placeholder="YYYY" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Entrance Exams */}
                <Card>
                    <CardHeader>
                        <CardTitle>4. Entrance Exams</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 bg-blue-50/50">
                        {/* IELTS/TOEFL */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-4">
                                <div className="min-w-[100px] font-medium text-sm">IELTS/TOEFL</div>
                                <FormField
                                    control={form.control}
                                    name="entranceExams.ieltsToefl"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-0 space-y-0">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Label className="text-muted-foreground font-normal">Taken-on</Label>
                                <Input {...form.register('entranceExams.ieltsToeflTaken')} className="w-32 h-9 bg-white" />
                            </div>
                            <FormField
                                control={form.control}
                                name="entranceExams.ieltsToeflReading"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">Reading</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entranceExams.ieltsToeflWriting"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">Writing</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entranceExams.ieltsToeflListening"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">Listening</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entranceExams.ieltsToeflSpeaking"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">Speaking</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entranceExams.ieltsToeflOverall"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">Overall</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                        </div>

                        {/* GRE/GMAT */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-4">
                                <div className="min-w-[100px] font-medium text-sm">GRE/GMAT</div>
                                <FormField
                                    control={form.control}
                                    name="entranceExams.greGmat"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-0 space-y-0">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Label className="text-muted-foreground font-normal">Taken-on</Label>
                                <Input {...form.register('entranceExams.greGmatTaken')} className="w-32 h-9 bg-white" />
                            </div>
                            <FormField
                                control={form.control}
                                name="entranceExams.greGmatQuant"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">Quant</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entranceExams.greGmatVerbal"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">Verbal</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entranceExams.greGmatAwa"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-muted-foreground font-normal">AWA</Label>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                    </div>
                                )}
                            />
                        </div>

                        {/* OTHER */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-4">
                                <div className="min-w-[100px] font-medium text-sm">OTHER</div>
                                <FormField
                                    control={form.control}
                                    name="entranceExams.other"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-0 space-y-0">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Label className="text-muted-foreground font-normal">Taken-on</Label>
                                <Input {...form.register('entranceExams.otherTaken')} className="w-32 h-9 bg-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-muted-foreground font-normal">Name</Label>
                                <Input {...form.register('entranceExams.otherName')} className="w-32 h-9 bg-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-muted-foreground font-normal">Score</Label>
                                <Input {...form.register('entranceExams.otherScore')} className="w-24 h-9 bg-white" />
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Declaration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Declaration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="declarationConfirmed"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            I confirm that the information given on this form is true, complete and accurate and no information requested or other material information has been omitted.
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="declarationSigned"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Signed (Type Full Name)</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="declarationDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {existingProfile ? 'Updating...' : 'Submitting...'}
                        </>
                    ) : (
                        existingProfile ? 'Update Profile' : 'Submit Profile'
                    )}
                </Button>
            </form>
        </Form >
    );
}
