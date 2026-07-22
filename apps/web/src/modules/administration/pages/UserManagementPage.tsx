import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { UserCheck, UserX, UserMinus } from 'lucide-react';
import { useState } from 'react';

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: '' });

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => adminApi.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  const columns = [
    { header: 'Name', accessorKey: 'firstName', cell: (row: any) => <div className="font-medium">{row.firstName} {row.lastName}</div> },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role', cell: (row: any) => <Badge variant="outline">{row.role.name}</Badge> },
    { header: 'Branch', accessorKey: 'branch', cell: (row: any) => row.branch?.name || 'All Branches' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row: any) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : row.status === 'SUSPENDED' ? 'warning' : 'destructive'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          {row.status !== 'ACTIVE' ? (
            <Button size="sm" variant="outline" onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'ACTIVE' })}>
              <UserCheck className="h-4 w-4 mr-1" /> Activate
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="text-warning-500 hover:text-warning-600" onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'SUSPENDED' })}>
              <UserMinus className="h-4 w-4 mr-1" /> Suspend
            </Button>
          )}
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
             <UserX className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage all enterprise users, roles, and access statuses.</p>
        </div>
        <Button>Invite User</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full max-w-sm rounded-lg border px-3 py-2 text-sm"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          {isLoading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : (
            <DataTable columns={columns} data={usersData?.users || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
