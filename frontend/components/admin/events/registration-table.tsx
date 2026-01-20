'use client';

import { useState } from 'react';
import { Registration } from '@/lib/api/admin/event-registrations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, ArrowUp, ArrowDown, UserCheck, XCircle } from 'lucide-react';

interface RegistrationTableProps {
    registrations: Registration[];
    onPromote?: (id: string) => Promise<void>;
    onDemote?: (id: string) => Promise<void>;
    onMarkAttended?: (id: string) => Promise<void>;
    onBulkMarkAttended?: (ids: string[]) => Promise<void>;
    loading?: boolean;
    showBulkActions?: boolean;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
    confirmed: { label: 'Confirmed', variant: 'default' },
    waitlisted: { label: 'Waitlisted', variant: 'warning' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
    attended: { label: 'Attended', variant: 'success' }
};

function formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function RegistrationTable({
    registrations,
    onPromote,
    onDemote,
    onMarkAttended,
    onBulkMarkAttended,
    loading = false,
    showBulkActions = true
}: RegistrationTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === registrations.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(registrations.map(r => r.id)));
        }
    };

    const handleAction = async (action: () => Promise<void>, id: string) => {
        setActionLoading(id);
        try {
            await action();
        } finally {
            setActionLoading(null);
        }
    };

    const handleBulkAttendance = async () => {
        if (onBulkMarkAttended && selectedIds.size > 0) {
            setActionLoading('bulk');
            try {
                await onBulkMarkAttended(Array.from(selectedIds));
                setSelectedIds(new Set());
            } finally {
                setActionLoading(null);
            }
        }
    };

    const confirmedSelected = registrations.filter(
        r => selectedIds.has(r.id) && r.registration_status === 'confirmed'
    );

    return (
        <div className="space-y-4">
            {/* Bulk Actions */}
            {showBulkActions && selectedIds.size > 0 && (
                <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm font-medium">
                        {selectedIds.size} selected
                    </span>
                    {confirmedSelected.length > 0 && onBulkMarkAttended && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleBulkAttendance}
                            disabled={actionLoading === 'bulk'}
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Mark {confirmedSelected.length} as Attended
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedIds(new Set())}
                    >
                        Clear
                    </Button>
                </div>
            )}

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            {showBulkActions && (
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedIds.size === registrations.length && registrations.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                            )}
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role / Tier</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead>Waitlist #</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                        <span className="ml-2 text-gray-500">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : registrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No registrations found
                                </TableCell>
                            </TableRow>
                        ) : (
                            registrations.map((registration) => {
                                const status = statusConfig[registration.registration_status] || statusConfig.confirmed;
                                const isLoading = actionLoading === registration.id;

                                return (
                                    <TableRow
                                        key={registration.id}
                                        className={selectedIds.has(registration.id) ? 'bg-primary/5' : ''}
                                    >
                                        {showBulkActions && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.has(registration.id)}
                                                    onCheckedChange={() => toggleSelect(registration.id)}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{registration.user?.fullName || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500">{registration.user?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={status.variant as any}>
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p>{registration.user?.role?.name || 'User'}</p>
                                                <p className="text-gray-500">{registration.user?.tier || 'FREE'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatDate(registration.registered_at)}
                                        </TableCell>
                                        <TableCell>
                                            {registration.waitlist_position ? (
                                                <span className="font-mono text-orange-600">
                                                    #{registration.waitlist_position}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                                        ) : (
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {registration.registration_status === 'waitlisted' && onPromote && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleAction(() => onPromote(registration.id), registration.id)}
                                                        >
                                                            <ArrowUp className="w-4 h-4 mr-2 text-green-600" />
                                                            Promote to Confirmed
                                                        </DropdownMenuItem>
                                                    )}
                                                    {registration.registration_status === 'confirmed' && onDemote && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleAction(() => onDemote(registration.id), registration.id)}
                                                        >
                                                            <ArrowDown className="w-4 h-4 mr-2 text-orange-600" />
                                                            Demote to Waitlist
                                                        </DropdownMenuItem>
                                                    )}
                                                    {registration.registration_status === 'confirmed' && onMarkAttended && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleAction(() => onMarkAttended(registration.id), registration.id)}
                                                        >
                                                            <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
                                                            Mark as Attended
                                                        </DropdownMenuItem>
                                                    )}
                                                    {registration.registration_status === 'cancelled' && (
                                                        <DropdownMenuItem disabled>
                                                            <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                                                            Registration Cancelled
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
