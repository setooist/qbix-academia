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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Check, ChevronsUpDown, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUsers, getActivityTemplates, createAssignment } from '@/lib/api/activity-mutations';
import { useAuth } from '@/lib/contexts/auth-context';
import { cn } from '@/lib/utils';

interface AssignActivityDialogProps {
    onSuccess?: () => void;
}

export function AssignActivityDialog({ onSuccess }: AssignActivityDialogProps) {
    const [open, setOpen] = useState(false);
    const [openCombobox, setOpenCombobox] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const { toast } = useToast();
    const { user: currentUser } = useAuth(); // Current user is the mentor

    const [formData, setFormData] = useState<{
        templateId: string;
        studentIds: string[];
        dueDate: string;
    }>({
        templateId: '',
        studentIds: [],
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
        if (!formData.templateId || formData.studentIds.length === 0 || !formData.dueDate) {
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
                assignees: formData.studentIds,
                mentor: currentUser?.documentId || currentUser?.id,
                due_date: formData.dueDate,
                assignment_status: 'not_started'
            });

            toast({
                title: 'Success',
                description: 'Activity assigned successfully',
            });
            setOpen(false);
            setFormData({ templateId: '', studentIds: [], dueDate: '' });
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

    const toggleStudent = (studentId: string) => {
        setFormData(prev => {
            const exists = prev.studentIds.includes(studentId);
            if (exists) {
                return { ...prev, studentIds: prev.studentIds.filter(id => id !== studentId) };
            } else {
                return { ...prev, studentIds: [...prev.studentIds, studentId] };
            }
        });
    };

    const removeStudent = (studentId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleStudent(studentId);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Activity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign New Activity</DialogTitle>
                    <DialogDescription>
                        Assign an activity template to one or more students.
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
                            <Label>Students</Label>
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className="w-full justify-between"
                                    >
                                        <span className="truncate">
                                            {formData.studentIds.length > 0
                                                ? `${formData.studentIds.length} student${formData.studentIds.length === 1 ? '' : 's'} selected`
                                                : "Select students..."}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[450px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search students..." />
                                        <CommandList>
                                            <CommandEmpty>No student found.</CommandEmpty>
                                            <CommandGroup>
                                                {users.map((user) => {
                                                    const userId = user.documentId || user.id?.toString();
                                                    const isSelected = formData.studentIds.includes(userId);
                                                    return (
                                                        <CommandItem
                                                            key={userId}
                                                            value={user.fullName || user.username || userId}
                                                            onSelect={() => toggleStudent(userId)}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    isSelected ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span>{user.fullName || user.username}</span>
                                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                            </div>
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Selected students display */}
                            {formData.studentIds.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-muted/20">
                                    {formData.studentIds.map((id) => {
                                        const student = users.find(u => (u.documentId || u.id?.toString()) === id);
                                        return (
                                            <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                                <span>{student?.fullName || student?.username || id}</span>
                                                <button
                                                    type="button"
                                                    className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    onClick={(e) => removeStudent(id, e)}
                                                    aria-label={`Remove ${student?.fullName || 'student'}`}
                                                >
                                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
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
