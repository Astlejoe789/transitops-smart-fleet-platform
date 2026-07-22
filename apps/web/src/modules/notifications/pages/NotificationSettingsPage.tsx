import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, NotificationPreferences } from '../services/notificationsApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, Mail, Smartphone, Radio, Settings } from 'lucide-react';

export default function NotificationSettingsPage() {
  const queryClient = useQueryClient();

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: notificationsApi.getPreferences,
  });

  const updateMutation = useMutation({
    mutationFn: notificationsApi.updatePreferences,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] })
  });

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    updateMutation.mutate({ [key]: value });
  };

  if (isLoading) return <div className="p-8 text-center">Loading preferences...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
        <p className="text-muted-foreground mt-2">Manage how and when you receive operational alerts.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" /> Delivery Channels
            </CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts within the dashboard</p>
                </div>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableNotifications} onChange={(e) => handleToggle('enableNotifications', e.target.checked)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive daily summaries and urgent alerts via email</p>
                </div>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableEmail} onChange={(e) => handleToggle('enableEmail', e.target.checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Text messages for critical breakdowns</p>
                </div>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableSMS} onChange={(e) => handleToggle('enableSMS', e.target.checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Radio className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Mobile push notifications for assigned trips</p>
                </div>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enablePush} onChange={(e) => handleToggle('enablePush', e.target.checked)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Alerts</CardTitle>
            <CardDescription>Select which modules can send you alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Insights & Analytics</p>
                <p className="text-sm text-muted-foreground">Smart recommendations and anomaly detection</p>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableAiAlerts} onChange={(e) => handleToggle('enableAiAlerts', e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fleet & Trips</p>
                <p className="text-sm text-muted-foreground">Dispatch alerts, driver assignments</p>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableFleetAlerts} onChange={(e) => handleToggle('enableFleetAlerts', e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance</p>
                <p className="text-sm text-muted-foreground">Preventative maintenance dues, breakdowns</p>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableMaintenanceAlerts} onChange={(e) => handleToggle('enableMaintenanceAlerts', e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Billing & Invoices</p>
                <p className="text-sm text-muted-foreground">Overdue payments, generated invoices</p>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableBillingAlerts} onChange={(e) => handleToggle('enableBillingAlerts', e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expenses & Fuel</p>
                <p className="text-sm text-muted-foreground">Expense approvals, fuel threshold alerts</p>
              </div>
              <input type="checkbox" className="h-5 w-5" checked={prefs?.enableExpenseAlerts} onChange={(e) => handleToggle('enableExpenseAlerts', e.target.checked)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
