'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, User, GraduationCap, Shield } from 'lucide-react';
import { addFeedback } from '@/lib/api/activity-mutations';

interface FeedbackMessage {
    id: string;
    author: string;
    authorRole: 'mentor' | 'student' | 'admin';
    message: string;
    timestamp: string;
}

interface FeedbackThreadProps {
    activityId: string;
    feedbackThread: FeedbackMessage[] | null;
    currentUserRole: 'mentor' | 'student' | 'admin';
    currentUserName: string;
    onFeedbackAdded?: () => void;
    disabled?: boolean;
}

export function FeedbackThread({
    activityId,
    feedbackThread,
    currentUserRole,
    currentUserName,
    onFeedbackAdded,
    disabled = false,
}: FeedbackThreadProps) {
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const messages = feedbackThread || [];

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await addFeedback(activityId, {
                author: currentUserName,
                authorRole: currentUserRole,
                message: newMessage.trim(),
                timestamp: new Date().toISOString(),
            });
            setNewMessage('');
            onFeedbackAdded?.();
        } catch (error) {
            console.error('Failed to send feedback:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'mentor':
                return <GraduationCap className="w-4 h-4" />;
            case 'admin':
                return <Shield className="w-4 h-4" />;
            default:
                return <User className="w-4 h-4" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'mentor':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'admin':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-4">
            {/* Message List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No feedback yet.</p>
                        <p className="text-sm">Start the conversation by sending a message.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <Card
                            key={msg.id}
                            className={`p-4 ${msg.authorRole === currentUserRole ? 'ml-8 bg-primary/5' : 'mr-8'}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${getRoleColor(msg.authorRole)}`}>
                                    {getRoleIcon(msg.authorRole)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{msg.author}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(msg.authorRole)}`}>
                                            {msg.authorRole}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* New Message Input */}
            {!disabled && (
                <div className="border-t pt-4">
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="resize-none"
                            rows={2}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleSend();
                                }
                            }}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={sending || !newMessage.trim()}
                            className="px-4"
                        >
                            {sending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Press Ctrl+Enter to send
                    </p>
                </div>
            )}
        </div>
    );
}
