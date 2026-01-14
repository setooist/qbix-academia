'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, FileText, Image, File, CheckCircle } from 'lucide-react';
import { uploadAssignmentSubmission } from '@/lib/api/assignment-mutations';

interface FileUploadProps {
    assignmentId: string;
    onUploadComplete?: () => void;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    disabled?: boolean;
}

interface SelectedFile {
    file: File;
    preview?: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

export function FileUpload({
    assignmentId,
    onUploadComplete,
    maxFiles = 5,
    maxSizeMB = 10,
    acceptedTypes = ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    disabled = false,
}: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
        if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const validateFile = (file: File): string | undefined => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File size exceeds ${maxSizeMB}MB limit`;
        }
        // Basic type checking (could be stricter)
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';
        const isDoc = file.type.includes('word') || file.type.includes('document');
        if (!isImage && !isPdf && !isDoc) {
            return 'File type not supported';
        }
        return undefined;
    };

    const handleFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const remainingSlots = maxFiles - selectedFiles.length;
        const filesToAdd = fileArray.slice(0, remainingSlots);

        const newFiles: SelectedFile[] = filesToAdd.map((file) => {
            const error = validateFile(file);
            return {
                file,
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
                status: error ? 'error' : 'pending',
                error,
            };
        });

        setSelectedFiles((prev) => [...prev, ...newFiles]);
    }, [selectedFiles.length, maxFiles]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => {
            const newFiles = [...prev];
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview!);
            }
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleUpload = async () => {
        const validFiles = selectedFiles.filter((f) => f.status === 'pending');
        if (validFiles.length === 0) return;

        setUploading(true);
        setSelectedFiles((prev) =>
            prev.map((f) => (f.status === 'pending' ? { ...f, status: 'uploading' } : f))
        );

        try {
            await uploadAssignmentSubmission(
                assignmentId,
                validFiles.map((f) => f.file)
            );

            setSelectedFiles((prev) =>
                prev.map((f) => (f.status === 'uploading' ? { ...f, status: 'success' } : f))
            );

            onUploadComplete?.();

            // Clear after success
            setTimeout(() => {
                setSelectedFiles([]);
            }, 2000);
        } catch (error) {
            console.error('Upload failed:', error);
            setSelectedFiles((prev) =>
                prev.map((f) =>
                    f.status === 'uploading' ? { ...f, status: 'error', error: 'Upload failed' } : f
                )
            );
        } finally {
            setUploading(false);
        }
    };

    const hasValidFiles = selectedFiles.some((f) => f.status === 'pending');

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                    ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={disabled ? undefined : handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                    disabled={disabled}
                />
                <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
                <p className="font-medium text-gray-900">
                    {dragActive ? 'Drop files here' : 'Drop files here or click to upload'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Supports PDF, DOCX, JPG, PNG (Max {maxSizeMB}MB per file, {maxFiles} files max)
                </p>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    {selectedFiles.map((item, index) => (
                        <Card key={index} className={`p-3 flex items-center gap-3 ${item.status === 'error' ? 'border-red-200 bg-red-50' : ''}`}>
                            {/* Preview or Icon */}
                            {item.preview ? (
                                <img
                                    src={item.preview}
                                    alt="Preview"
                                    className="w-10 h-10 object-cover rounded"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                                    {getFileIcon(item.file)}
                                </div>
                            )}

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
                                {item.error && <p className="text-xs text-red-500">{item.error}</p>}
                            </div>

                            {/* Status/Actions */}
                            <div className="flex items-center gap-2">
                                {item.status === 'uploading' && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                                )}
                                {item.status === 'success' && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {(item.status === 'pending' || item.status === 'error') && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {selectedFiles.length > 0 && (
                <Button
                    onClick={handleUpload}
                    disabled={!hasValidFiles || uploading || disabled}
                    className="w-full"
                >
                    {uploading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload {selectedFiles.filter((f) => f.status === 'pending').length} file(s)
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
