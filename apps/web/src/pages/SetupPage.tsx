import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Settings, Building2, Users, Database } from 'lucide-react';

const SetupPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Initial Setup" 
        subtitle="Configure your company profile and preferences to get started." 
      />
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="glass-card">
          <CardHeader>
            <Building2 className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Setup your organization details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Configure Profile</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <Users className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Invite your team members.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Invite Users</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <Database className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>Data Import</CardTitle>
            <CardDescription>Import your existing data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Import Data</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <Settings className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure localization and defaults.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">System Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SetupPage;
