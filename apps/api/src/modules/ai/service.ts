/**
 * Ai Service
 *
 * Business logic for the AI Insights and Predictive Intelligence module.
 */
import { prisma } from '../../database/index.js';
import { LocalAiProvider } from './providers/local.provider.js';
import { IAiProvider } from './providers/ai-provider.interface.js';

export class AiService {
  private aiProvider: IAiProvider;

  constructor() {
    // We default to the Local rule-based provider as requested.
    // In the future, config can dictate `new OpenAiProvider()` or `new GeminiProvider()`.
    this.aiProvider = new LocalAiProvider();
    this.aiProvider.initialize({});
  }

  /**
   * Log AI request to the existing Audit Log system.
   */
  private async logAiUsage(companyId: string, userId: string, _action: string, details: string) {
    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'UPDATE', // closest enum match in existing schema for a generic system log
        entityType: 'AI_MODULE',
        entityId: 'AI',
        newValues: { details },
        ipAddress: 'internal',
        userAgent: 'ai-service',
      }
    });
  }

  /**
   * Generate Dashboard Scores and Forecasts
   */
  async getDashboardMetrics(companyId: string, userId: string) {
    // Real implementation would pull historical data, for now we pull some basic counts to seed the rules.
    const maintenanceLogs = await prisma.maintenanceLog.count({ where: { companyId, status: 'SCHEDULED' } });

    // Mock calculations based on simple DB counts
    const fleetHealthScore = Math.max(0, 100 - (maintenanceLogs * 5));
    const driverPerformanceScore = 92; // Mocked high score
    const vehicleRiskScore = maintenanceLogs > 5 ? 75 : 20;

    // Get predictions from the AI Provider
    const revenueForecast = await this.aiProvider.generateForecast('REVENUE', {});
    const expenseForecast = await this.aiProvider.generateForecast('EXPENSE', {});
    const fuelForecast = await this.aiProvider.generateForecast('FUEL', {});
    const maintenanceForecast = await this.aiProvider.generateForecast('MAINTENANCE', {});

    await this.logAiUsage(companyId, userId, 'AI_DASHBOARD', 'Generated Dashboard Metrics & Forecasts');

    return {
      scores: {
        fleetHealth: fleetHealthScore,
        driverPerformance: driverPerformanceScore,
        vehicleRisk: vehicleRiskScore,
      },
      forecasts: {
        revenue: revenueForecast.data,
        expense: expenseForecast.data,
        fuel: fuelForecast.data,
        maintenance: maintenanceForecast.data,
      }
    };
  }

  /**
   * Generate Smart Insights
   */
  async getInsights(companyId: string, userId: string) {
    // Generate AI insights using the provider
    const insights = await this.aiProvider.generateInsights({ companyId });
    
    await this.logAiUsage(companyId, userId, 'AI_INSIGHTS', 'Generated Smart Insights');
    
    return insights;
  }

  /**
   * Natural Language Analytics
   */
  async askQuestion(companyId: string, userId: string, question: string) {
    // In a real system, we might pull context from Prisma here to feed the LLM.
    const context = {};
    const answer = await this.aiProvider.askQuestion(question, context);
    
    await this.logAiUsage(companyId, userId, 'AI_CHAT', `Asked Question: ${question.substring(0, 50)}...`);
    
    return {
      question,
      answer,
      timestamp: new Date()
    };
  }
}

