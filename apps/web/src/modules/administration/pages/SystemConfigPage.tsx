import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import { Save, Bot, Lock, Server } from 'lucide-react';

function SettingSection({ title, icon: Icon, description, category }: any) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({});
  
  const { data: setting, isLoading } = useQuery({
    queryKey: ['admin', 'settings', category],
    queryFn: () => adminApi.getSettings(category),
  });

  useEffect(() => {
    if (setting?.value) setFormData(setting.value);
  }, [setting]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateSettings(category, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings', category] });
      alert('Settings saved successfully!');
    }
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary-500" /> {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {category === 'AI' && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm font-medium">AI Provider</label>
              <select name="provider" value={formData.provider || 'LOCAL'} onChange={handleChange} className="w-full mt-1 rounded-md border px-3 py-2 text-sm bg-transparent">
                <option value="LOCAL">Local Rule-Based (Demo)</option>
                <option value="OPENAI">OpenAI</option>
                <option value="GEMINI">Google Gemini</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">API Key</label>
              <Input type="password" name="apiKey" value={formData.apiKey || ''} onChange={handleChange} placeholder="sk-..." />
            </div>
            <div>
              <label className="text-sm font-medium">Model Name</label>
              <Input type="text" name="modelName" value={formData.modelName || 'gpt-4'} onChange={handleChange} />
            </div>
          </div>
        )}
        {category === 'SECURITY' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Force Two-Factor Auth</p>
                <p className="text-sm text-muted-foreground">Require 2FA for all users.</p>
              </div>
              <input type="checkbox" name="force2FA" checked={formData.force2FA || false} onChange={handleChange} className="h-5 w-5" />
            </div>
            <div>
              <label className="text-sm font-medium">Session Timeout (minutes)</label>
              <Input type="number" name="sessionTimeout" value={formData.sessionTimeout || 60} onChange={handleChange} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SystemConfigPage() {
  const [activeTab, setActiveTab] = useState('AI');

  const tabs = [
    { id: 'AI', label: 'AI Engine', icon: Bot },
    { id: 'SECURITY', label: 'Security', icon: Lock },
    { id: 'INTEGRATIONS', label: 'Integrations', icon: Server },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground mt-2">Manage global platform settings and integrations.</p>
      </div>

      <div className="flex gap-4 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'AI' && <SettingSection title="AI & Predictive Intelligence" description="Configure generative AI endpoints and models." category="AI" icon={Bot} />}
        {activeTab === 'SECURITY' && <SettingSection title="Security Center" description="Manage session policies and authentication rules." category="SECURITY" icon={Lock} />}
        {activeTab === 'INTEGRATIONS' && <SettingSection title="Integrations" description="Manage 3rd party API keys (Stripe, SendGrid, Twilio, Google Maps)." category="INTEGRATIONS" icon={Server} />}
      </div>
    </div>
  );
}
