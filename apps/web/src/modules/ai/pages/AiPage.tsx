import { useQuery } from '@tanstack/react-query';
import { aiApi } from '../services/aiApi';
import { InsightCard } from '../components/InsightCard';
import { ForecastWidget } from '../components/ForecastWidget';
import { AiChatPanel } from '../components/AiChatPanel';
import { Sparkles, Activity, ShieldAlert, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiPage() {
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['ai', 'dashboard'],
    queryFn: aiApi.getDashboardMetrics
  });

  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['ai', 'insights'],
    queryFn: aiApi.getInsights
  });

  if (isDashboardLoading || isInsightsLoading) {
    return <div className="p-8 text-center">Loading AI Insights...</div>;
  }

  const scores = dashboard?.scores;
  const forecasts = dashboard?.forecasts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights & Predictive Intelligence</h1>
        <p className="text-muted-foreground mt-2">
          Harness the power of machine learning to predict trends, identify risks, and optimize your fleet operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores?.fleetHealth ?? 0}/100</div>
            <p className="text-xs text-muted-foreground">Based on maintenance history</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Driver Performance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores?.driverPerformance ?? 0}/100</div>
            <p className="text-xs text-muted-foreground">Based on safety and efficiency</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicle Risk Score</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores?.vehicleRisk ?? 0}/100</div>
            <p className="text-xs text-muted-foreground">Probability of breakdown this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ForecastWidget title="Revenue Forecast" data={forecasts?.revenue || []} color="#10b981" />
            <ForecastWidget title="Expense Forecast" data={forecasts?.expense || []} color="#ef4444" />
            <ForecastWidget title="Fuel Consumption Forecast" data={forecasts?.fuel || []} color="#3b82f6" />
            <ForecastWidget title="Maintenance Forecast" data={forecasts?.maintenance || []} color="#f59e0b" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Smart Recommendations
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {insights?.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-4">
          <AiChatPanel />
        </div>
      </div>
    </div>
  );
}
