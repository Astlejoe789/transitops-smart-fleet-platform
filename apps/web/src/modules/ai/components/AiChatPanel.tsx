import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send, Bot, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../services/aiApi';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export function AiChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Hello! Ask me about revenue, maintenance, customers, or expenses.', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const chatMutation = useMutation({
    mutationFn: aiApi.askQuestion,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: data.answer, sender: 'ai' }
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: 'Error communicating with AI Provider.', sender: 'ai' }
      ]);
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user'
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(userMessage.text);
    setInput('');
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Natural Language Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex items-start gap-2 max-w-[85%]", msg.sender === 'user' ? "ml-auto flex-row-reverse" : "")}
            >
              <div className="mt-1">
                {msg.sender === 'ai' ? (
                  <div className="bg-primary/10 p-1.5 rounded-full"><Bot className="h-4 w-4 text-primary" /></div>
                ) : (
                  <div className="bg-secondary p-1.5 rounded-full"><User className="h-4 w-4 text-foreground" /></div>
                )}
              </div>
              <div className={cn(
                "p-3 rounded-lg text-sm",
                msg.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1.5 rounded-full"><Bot className="h-4 w-4 text-primary" /></div>
              <div className="p-3 rounded-lg text-sm bg-muted text-foreground animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
        
        <form 
          className="flex gap-2" 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask a question..."
            disabled={chatMutation.isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={chatMutation.isPending || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
