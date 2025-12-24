'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I'm your QBIX AI assistant. How can I help you with your study abroad journey?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    "Tell me about university selection",
    "How does visa assistance work?",
    "What countries do you support?",
    "Schedule a consultation"
  ];

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    setMessages(prev => [...prev, { text: messageText, isUser: true }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "Thank you for your question! Our team would be happy to assist you. ";

      if (messageText.toLowerCase().includes('university') || messageText.toLowerCase().includes('college')) {
        response += "We help students select from 100+ top-tier universities across 15+ countries. Our expert counselors provide personalized guidance based on your profile, budget, and career goals. Would you like to schedule a free consultation?";
      } else if (messageText.toLowerCase().includes('visa')) {
        response += "Our visa assistance includes document preparation, mock interviews, and application tracking. We have an excellent success rate! Would you like to know more about the visa process for a specific country?";
      } else if (messageText.toLowerCase().includes('countr')) {
        response += "We support students going to Germany, US, UK, Canada, Malaysia, Ireland, Australia, New Zealand, and more! Each country has unique requirements and opportunities. Which country interests you?";
      } else if (messageText.toLowerCase().includes('consultation') || messageText.toLowerCase().includes('schedule')) {
        response += "Great! We offer free initial consultations. You can reach out to us through our contact page or call us directly. Would you like me to redirect you to the contact page?";
      } else if (messageText.toLowerCase().includes('cost') || messageText.toLowerCase().includes('fee')) {
        response += "Our counseling services are FREE! We only succeed when you succeed. We'll help you find universities and programs that fit your budget, including scholarship opportunities. Would you like to discuss education loans?";
      } else {
        response += "For detailed information, I recommend speaking with one of our expert counselors. Would you like to schedule a free consultation or visit our contact page?";
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full shadow-2xl hover:shadow-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-pulse hover:animate-none"
        >
          <div className="relative">
            <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
            Ask me anything!
            <div className="absolute top-full right-6 -mt-1 border-8 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl flex flex-col bg-white/95 backdrop-blur-lg border-2 border-primary/20 animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-primary to-orange p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">QBIX AI Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom duration-300`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser
                    ? 'bg-gradient-to-br from-primary to-orange'
                    : 'bg-gradient-to-br from-gray-600 to-gray-800'
                }`}>
                  {message.isUser ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                    message.isUser
                      ? 'bg-gradient-to-br from-primary to-orange text-white rounded-tr-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-3 grid grid-cols-2 gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(reply)}
                  className="text-xs p-2 bg-white hover:bg-primary/10 border border-gray-200 hover:border-primary rounded-lg transition-all duration-200 text-gray-700 hover:text-primary text-left"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 border-gray-300 focus:border-primary"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-primary to-orange hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
