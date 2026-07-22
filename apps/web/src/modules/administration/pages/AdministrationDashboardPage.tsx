import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Server, Activity, Database, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdministrationDashboardPage() {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['admin', 'health'],
    queryFn: adminApi.getSystemHealth,
  });

  if (isLoading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

  const { stats, health } = healthData || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administration Console</h1>
        <p className="text-muted-foreground mt-2">Enterprise portal for system management, security, and configuration.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/dashboard/admin/users">
          <Card className="hover:border-primary-500 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.activeUsers || 0} active currently
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/admin/roles">
          <Card className="hover:border-primary-500 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRoles || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {stats?.branchesCount || 0} branches
              </p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> {health?.apiStatus || 'UNKNOWN'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Version {health?.apiVersion || 'Unknown'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Latency</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health?.dbLatency || '0ms'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Status: {health?.dbStatus || 'UNKNOWN'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-500" />
              Resource Usage (Simulated)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">{health?.memoryUsage}</span>
              </div>
              <div className="w-full bg-surface-200 rounded-full h-2.5 dark:bg-surface-800">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">CPU Load</span>
                <span className="text-sm text-muted-foreground">{health?.cpuUsage}</span>
              </div>
              <div className="w-full bg-surface-200 rounded-full h-2.5 dark:bg-surface-800">
                <div className="bg-warning-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Storage Capacity</span>
                <span className="text-sm text-muted-foreground">{health?.storageUsage}</span>
              </div>
              <div className="w-full bg-surface-200 rounded-full h-2.5 dark:bg-surface-800">
                <div className="bg-danger-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link to="/dashboard/admin/users" className="flex items-center justify-center p-4 border rounded-xl hover:bg-surface-100 transition-colors dark:hover:bg-surface-800 text-sm font-medium">
              Manage Users
            </Link>
            <Link to="/dashboard/admin/roles" className="flex items-center justify-center p-4 border rounded-xl hover:bg-surface-100 transition-colors dark:hover:bg-surface-800 text-sm font-medium">
              RBAC Settings
            </Link>
            <Link to="/dashboard/admin/settings" className="flex items-center justify-center p-4 border rounded-xl hover:bg-surface-100 transition-colors dark:hover:bg-surface-800 text-sm font-medium">
              System Configuration
            </Link>
            <Link to="/dashboard/admin/audit" className="flex items-center justify-center p-4 border rounded-xl hover:bg-surface-100 transition-colors dark:hover:bg-surface-800 text-sm font-medium">
              View Audit Logs
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
