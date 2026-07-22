import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Shield, Check } from 'lucide-react';

export default function RoleManagementPage() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: adminApi.getRoles,
  });

  const { data: permissions, isLoading: permsLoading } = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: adminApi.getPermissions,
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string, permissionIds: string[] }) => adminApi.assignRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      alert('Permissions updated successfully!');
    }
  });

  if (rolesLoading || permsLoading) return <div className="p-8 text-center">Loading RBAC matrix...</div>;

  const role = roles?.find((r: any) => r.id === selectedRole) || roles?.[0];
  if (!selectedRole && role) setSelectedRole(role.id);

  const rolePermIds = new Set(role?.rolePermissions.map((rp: any) => rp.permission.id) || []);

  const handleTogglePermission = (permId: string) => {
    if (!role || role.isSystem) return; // Cannot edit system roles
    const current = new Set(rolePermIds);
    if (current.has(permId)) current.delete(permId);
    else current.add(permId);
    
    updatePermissionsMutation.mutate({
      roleId: role.id,
      permissionIds: Array.from(current) as string[]
    });
  };

  // Group permissions by module
  const modules: Record<string, any[]> = {};
  permissions?.forEach((p: any) => {
    if (!modules[p.module]) modules[p.module] = [];
    modules[p.module].push(p);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role & Permission Matrix</h1>
          <p className="text-muted-foreground mt-2">Configure precise granular access control via RBAC.</p>
        </div>
        <Button>Create Role</Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold px-2">Available Roles</h3>
          <div className="flex flex-col gap-2">
            {roles?.map((r: any) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`text-left px-4 py-3 rounded-xl border transition-colors flex items-center justify-between ${
                  selectedRole === r.id ? 'bg-primary-50 border-primary-500 dark:bg-primary-900/20' : 'bg-card hover:bg-muted/50'
                }`}
              >
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.rolePermissions.length} permissions</div>
                </div>
                {r.isSystem && <Shield className="h-4 w-4 text-warning-500" />}
              </button>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{role?.name} Permissions</CardTitle>
                <CardDescription>
                  {role?.isSystem ? 'System roles cannot be modified.' : 'Toggle permissions for this role.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Object.entries(modules).map(([moduleName, perms]) => (
                <div key={moduleName}>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 border-b pb-2">{moduleName}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {perms.map((p) => {
                      const hasPerm = rolePermIds.has(p.id);
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => handleTogglePermission(p.id)}
                          className={`
                            relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                            ${role?.isSystem ? 'opacity-70 cursor-not-allowed' : 'hover:border-primary-400'}
                            ${hasPerm ? 'bg-primary-50 border-primary-300 dark:bg-primary-900/20 dark:border-primary-800' : 'bg-surface-50 dark:bg-surface-900'}
                          `}
                        >
                          <div className={`h-4 w-4 rounded border flex items-center justify-center ${hasPerm ? 'bg-primary-500 border-primary-500' : 'border-surface-300'}`}>
                            {hasPerm && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize">{p.action}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
