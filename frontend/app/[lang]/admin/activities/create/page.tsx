'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { createActivity, getUsers, getCategories } from '@/lib/api/activity-mutations';
import {
    ArrowLeft,
    Save,
    Users,
    Calendar,
    FileText,
    Tag,
    Loader2
} from 'lucide-react';

interface UserOption {
    id: string;
    username: string;
    email: string;
    role?: { name: string };
}

interface CategoryOption {
    id: string;
    attributes: {
        name: string;
        slug: string;
    };
}

export default function CreateActivityPage() {
    const router = useRouter();
    const { isAdmin, loading: permsLoading } = usePermissions();

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [fetchingData, setFetchingData] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        description: '',
        categoryId: '',
        assigneeId: '',
        mentorId: '',
        startDate: '',
        dueDate: '',
        goFromLink: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchData() {
            try {
                const [usersData, categoriesData] = await Promise.all([
                    getUsers().catch(() => []),
                    getCategories().catch(() => []),
                ]);
                setUsers(Array.isArray(usersData) ? usersData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setFetchingData(false);
            }
        }
        fetchData();
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (formData.dueDate && formData.startDate && new Date(formData.dueDate) < new Date(formData.startDate)) {
            newErrors.dueDate = 'Due date must be after start date';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await createActivity({
                title: formData.title,
                excerpt: formData.excerpt || undefined,
                description: formData.description ? [{ type: 'paragraph', children: [{ type: 'text', text: formData.description }] }] : undefined,
                category: formData.categoryId || undefined,
                assignee: formData.assigneeId || undefined,
                mentor: formData.mentorId || undefined,
                startDate: formData.startDate || undefined,
                dueDate: formData.dueDate || undefined,
            });

            router.push('/admin/activities');
        } catch (error: any) {
            console.error('Failed to create activity:', error);
            setErrors({ submit: error.message || 'Failed to create activity' });
        } finally {
            setLoading(false);
        }
    };

    if (permsLoading || fetchingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Get students and mentors from users
    const students = users.filter((u) => u.role?.name?.toLowerCase() === 'student' || !u.role);
    const mentors = users.filter((u) =>
        u.role?.name?.toLowerCase() === 'mentor' ||
        u.role?.name?.toLowerCase() === 'admin'
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Activities
                </Button>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Define the activity title, description, and instructions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="e.g., Build a Portfolio Website"
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Short Description</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => handleChange('excerpt', e.target.value)}
                                        placeholder="Brief summary of the activity..."
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Detailed Instructions</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Provide detailed instructions, requirements, and expectations..."
                                        rows={6}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="goFromLink">Reference Link (Optional)</Label>
                                    <Input
                                        id="goFromLink"
                                        type="url"
                                        value={formData.goFromLink}
                                        onChange={(e) => handleChange('goFromLink', e.target.value)}
                                        placeholder="https://example.com/resource"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Link to external resources or examples
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category & Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Tag className="w-5 h-5 mr-2" />
                                    Category
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(value) => handleChange('categoryId', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.attributes?.name || 'Unknown'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Assignment
                                </CardTitle>
                                <CardDescription>
                                    Assign this activity to a student and mentor
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="assignee">Assign to Student</Label>
                                        <Select
                                            value={formData.assigneeId}
                                            onValueChange={(value) => handleChange('assigneeId', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a student" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        {user.username || user.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Leave empty to create as template
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="mentor">Assign Mentor</Label>
                                        <Select
                                            value={formData.mentorId}
                                            onValueChange={(value) => handleChange('mentorId', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a mentor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        {user.username || user.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Timeline
                                </CardTitle>
                                <CardDescription>
                                    Set start and due dates for the activity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={(e) => handleChange('startDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dueDate">Due Date</Label>
                                        <Input
                                            id="dueDate"
                                            type="datetime-local"
                                            value={formData.dueDate}
                                            onChange={(e) => handleChange('dueDate', e.target.value)}
                                            className={errors.dueDate ? 'border-red-500' : ''}
                                        />
                                        {errors.dueDate && (
                                            <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                {errors.submit}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Create Activity
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
