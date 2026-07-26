const fs = require('fs');
const path = require('path');

const replacements = [
  { file: 'modules/drivers/pages/DriversPage.tsx', replace: 'import { PageContainer, PageHeader } from "@/components/layout";', with: 'import { PageHeader } from "@/components/layout";' },
  { file: 'modules/maintenance/pages/MaintenancePage.tsx', replace: 'import { PageContainer, PageHeader } from "@/components/layout";', with: 'import { PageHeader } from "@/components/layout";' },
  { file: 'modules/maintenance/pages/MaintenancePage.tsx', replace: "import { Button } from '@/components/ui/Button';", with: '' },
  { file: 'modules/maintenance/pages/MaintenancePage.tsx', replace: "const handleCreate = () => {", with: "const _handleCreate = () => {" },
  { file: 'modules/notifications/pages/NotificationSettingsPage.tsx', replace: 'import { PageContainer, PageHeader } from "@/components/layout";', with: 'import { PageContainer } from "@/components/layout";' },
  { file: 'modules/reports/pages/ReportsPage.tsx', replace: "import { ExportButton } from '../components/ExportButton';", with: '' },
  { file: 'modules/reports/pages/ReportsPage.tsx', replace: "const [reportType, setReportType] = useState<ReportType>('FLEET_UTILIZATION');", with: "const [reportType, _setReportType] = useState<ReportType>('FLEET_UTILIZATION');" },
  { file: 'modules/trips/pages/TripDetailsPage.tsx', replace: "import { Badge } from '@/components/ui/Badge';", with: '' },
  { file: 'modules/vendors/pages/VendorDetailsPage.tsx', replace: 'import { PageContainer, PageHeader } from "@/components/layout";', with: 'import { PageContainer } from "@/components/layout";' }
];

for (const rep of replacements) {
  const filePath = path.join(__dirname, '../apps/web/src', rep.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(rep.replace, rep.with);
    fs.writeFileSync(filePath, content);
    console.log('Fixed', rep.file);
  }
}
