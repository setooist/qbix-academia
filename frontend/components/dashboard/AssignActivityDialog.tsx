'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUsers, getActivityTemplates, createAssignment } from '@/lib/api/activity-mutations';
import { useAuth } from '@/lib/contexts/auth-context';

interface AssignActivityDialogProps {
    onSuccess?: () => void;
}

export function AssignActivityDialog({ onSuccess }: AssignActivityDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const { toast } = useToast();
    const { user: currentUser } = useAuth(); // Current user is the mentor

    const [formData, setFormData] = useState({
        templateId: '',
        studentId: '',
        dueDate: '',
    });

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    async function fetchData() {
        try {
            setLoading(true);
            const [usersData, templatesData] = await Promise.all([
                getUsers(),
                getActivityTemplates()
            ]);
            setUsers(usersData);
            setTemplates(templatesData);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load users or templates',
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.templateId || !formData.studentId || !formData.dueDate) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please fill in all fields',
            });
            return;
        }

        try {
            setSubmitting(true);
            await createAssignment({
                activity_template: formData.templateId,
                assignees: [formData.studentId],
                mentor: currentUser?.documentId || currentUser?.id,
                due_date: formData.dueDate,
                assignment_status: 'not_started'
            });

            toast({
                title: 'Success',
                description: 'Activity assigned successfully',
            });
            setOpen(false);
            setFormData({ templateId: '', studentId: '', dueDate: '' });
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Assignment Failed',
                description: error.message || 'Could not create assignment',
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Activity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign New Activity</DialogTitle>
                    <DialogDescription>
                        Assign an activity template to a student.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="template">Activity Template</Label>
                            <Select
                                value={formData.templateId}
                                onValueChange={(value) => setFormData({ ...formData, templateId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem key={template.documentId || template.id} value={template.documentId || template.id?.toString()}>
                                            {template.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="student">Student</Label>
                            <Select
                                value={formData.studentId}
                                onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.documentId || u.id} value={u.documentId || u.id?.toString()}>
                                            {u.fullName || u.username} ({u.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Assign Activity
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
