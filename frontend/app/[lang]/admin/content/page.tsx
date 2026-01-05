'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/use-permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBlogs, BlogPost } from '@/lib/api/blogs';

export default function ContentManagement() {
  const router = useRouter();
  const { hasPermission, loading } = usePermissions();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    if (!loading && !hasPermission('content.read')) {
      router.push('/');
    }
  }, [hasPermission, loading, router]);

  useEffect(() => {
    async function fetchBlogs() {
      const data = await getBlogs();
      setBlogs(data);
      setLoadingBlogs(false);
    }
    if (hasPermission('content.read')) {
      fetchBlogs();
    }
  }, [hasPermission]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">Manage blogs and editorial workflows</p>
          </div>
          {hasPermission('content.create') && (
            <Button onClick={() => window.open(process.env.NEXT_PUBLIC_STRAPI_URL + '/admin', '_blank')}>
              Create Content (Strapi)
            </Button>
          )}
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Blogs</CardTitle>
            <CardDescription>
              View and manage blog posts and their editorial status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingBlogs ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading blogs...</p>
              </div>
            ) : (
              blogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No blogs found.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map(blog => (
                        <TableRow key={blog.documentId} className="hover:bg-gray-50">
                          <TableCell className="font-medium max-w-[300px] truncate" title={blog.title}>
                            {blog.title}
                          </TableCell>
                          <TableCell>{blog.author || '-'}</TableCell>
                          <TableCell>{blog.category?.name || '-'}</TableCell>
                          <TableCell>
                            <EditorialStatusBadge status={blog.editorialStatus || 'Draft'} />
                          </TableCell>
                          <TableCell>{blog.published ? new Date(blog.published).toLocaleDateString() : '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/blogs/${blog.slug}`)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EditorialStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Draft': 'bg-gray-100 text-gray-800',
    'In Review': 'bg-yellow-100 text-yellow-800',
    'Scheduled': 'bg-blue-100 text-blue-800',
    'Published': 'bg-green-100 text-green-800',
    'Updated': 'bg-indigo-100 text-indigo-800',
    'Archived': 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles['Draft']}`}>
      {status}
    </span>
  );
}