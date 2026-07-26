import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { PageContainer, PageHeader } from "@/components/layout";

export default function AuditLogPage() {
  const { data: auditData, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs'],
    queryFn: () => adminApi.getAuditLogs(),
  });

  const columns = [
    { header: 'Action', accessorKey: 'action', cell: (row: any) => <Badge variant="outline">{row.action}</Badge> },
    { header: 'Entity', accessorKey: 'entityType', cell: (row: any) => <span className="font-mono text-xs">{row.entityType}</span> },
    { header: 'User', accessorKey: 'user', cell: (row: any) => row.user ? `${row.user.firstName} ${row.user.lastName}` : 'System' },
    { header: 'IP Address', accessorKey: 'ipAddress' },
    { header: 'Time', accessorKey: 'createdAt', cell: (row: any) => formatDistanceToNow(new Date(row.createdAt), { addSuffix: true }) },
  ];

  return (
    <PageContainer className="space-y-6">
      <PageHeader 
                  title="Audit Center"
                />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading audit events...</div>
          ) : (
            <DataTable columns={columns} data={auditData?.logs || []} />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
