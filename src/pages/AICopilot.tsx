import React, { useState, useRef, useEffect } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { generateAICopilotResponse } from '@/services/aiService';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AICopilot() {
  const { leads, deals, activities } = useCRMStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Accufy AI. I can help you summarize deals, draft emails to leads, or analyze your pipeline. How can I assist you today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const context = JSON.stringify({
      leads: leads.slice(0, 10), // Limit to avoid token limits
      deals: deals.slice(0, 10),
      recentActivities: activities.slice(0, 10)
    });

    const response = await generateAICopilotResponse(userMessage.content, context);

    const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          AI Copilot
        </h1>
        <p className="text-sm text-slate-500">Your intelligent CRM assistant powered by Gemini.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-slate-200">
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-4 max-w-[80%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === 'user' ? "bg-indigo-100 text-indigo-700" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                )}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:text-slate-800">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none px-5 py-3.5 bg-white border border-slate-200 text-slate-800 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-sm text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask Accufy AI to summarize deals, draft emails..."
                className="pr-12 py-6 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 shadow-sm text-base"
              />
              <Button 
                size="icon" 
                className="absolute right-2 h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
              <button onClick={() => setInput("Summarize my active deals")} className="whitespace-nowrap text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200">
                Summarize active deals
              </button>
              <button onClick={() => setInput("Draft an email to Alice Johnson")} className="whitespace-nowrap text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200">
                Draft email to Alice
              </button>
              <button onClick={() => setInput("What are my tasks for today?")} className="whitespace-nowrap text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200">
                My tasks today
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
