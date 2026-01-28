
import { getNotificationLogs } from "@/lib/api/admin/notification-logs";

export const dynamic = 'force-dynamic';


export default async function NotificationLogsPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const { data: logs, meta } = await getNotificationLogs(page);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Notification Logs</h1>

            <div className="rounded-md border p-4 bg-white shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50 text-gray-700 font-semibold border-b">
                            <tr>
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Channel</th>
                                <th className="px-4 py-3">Recipient</th>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs?.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-gray-500">No logs found</td>
                                </tr>
                            )}
                            {logs?.map((log: any) => {
                                const attr = log.attributes;
                                const isError = attr.status === 'failed' || attr.status === 'bounced';

                                return (
                                    <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(attr.sent_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                                {attr.notification_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 capitalize">{attr.channel}</td>
                                        <td className="px-4 py-3">
                                            {attr.recipient_email || attr.recipient_phone}
                                        </td>
                                        <td className="px-4 py-3 max-w-xs truncate">
                                            {attr.subject || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${isError
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {attr.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <details className="cursor-pointer text-xs text-gray-600">
                                                <summary className="hover:text-blue-600">View Data</summary>
                                                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto max-w-sm">
                                                    {JSON.stringify({
                                                        error: attr.error_message,
                                                        data: attr.template_data
                                                    }, null, 2)}
                                                </pre>
                                            </details>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                        Page {meta?.pagination?.page} of {meta?.pagination?.pageCount}
                    </div>
                    <div className="space-x-2">
                        {page > 1 && (
                            <a
                                href={`?page=${page - 1}`}
                                className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                            >
                                Previous
                            </a>
                        )}
                        {page < (meta?.pagination?.pageCount || 0) && (
                            <a
                                href={`?page=${page + 1}`}
                                className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                            >
                                Next
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
