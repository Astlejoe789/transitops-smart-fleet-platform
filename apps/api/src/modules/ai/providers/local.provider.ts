import { AiForecast, AiInsight, IAiProvider } from './ai-provider.interface.js';

export class LocalAiProvider implements IAiProvider {
  initialize(_config: Record<string, any>): void {
    // Initialization logic for local rules-based model
  }

  async askQuestion(question: string, _contextData?: any): Promise<string> {
    const q = question.toLowerCase();
    
    // Simple rule-based answering
    if (q.includes('maintenance')) {
      return "Vehicle TRK-001 has accrued $3,450 in maintenance costs this month, making it the most expensive vehicle.";
    }
    if (q.includes('revenue')) {
      return "Total revenue for the current month is up 12% compared to last month.";
    }
    if (q.includes('customer')) {
      return "Acme Corp generated the highest revenue this quarter ($142,000).";
    }
    if (q.includes('expense')) {
      return "Fuel is your biggest operational expense, accounting for 45% of total costs.";
    }

    return "I couldn't identify the specific intent of your question. Try asking about revenue, maintenance, customers, or expenses.";
  }

  async generateInsights(_data: any): Promise<AiInsight[]> {
    return [
      {
        title: 'Fuel Usage Anomaly',
        description: 'Vehicle VAN-332 consumed 20% more fuel than its 3-month average during identical routes.',
        type: 'WARNING'
      },
      {
        title: 'High Customer Value',
        description: 'TechLogistics Inc. has increased trip volume by 30% this quarter.',
        type: 'SUCCESS'
      },
      {
        title: 'Upcoming Maintenance',
        description: '5 vehicles are approaching their scheduled maintenance mileage threshold.',
        type: 'INFO'
      }
    ];
  }

  async generateForecast(category: 'MAINTENANCE' | 'FUEL' | 'REVENUE' | 'EXPENSE' | 'TRIP_DEMAND', _historicalData: any): Promise<AiForecast> {
    // Mocking future predictive points
    const forecastData = [];
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    
    for (let i = 0; i < 6; i++) {
      let value = 0;
      switch (category) {
        case 'REVENUE': value = 50000 + (Math.random() * 15000); break;
        case 'EXPENSE': value = 30000 + (Math.random() * 8000); break;
        case 'FUEL': value = 4000 + (Math.random() * 500); break;
        case 'MAINTENANCE': value = 5000 + (Math.random() * 2000); break;
        case 'TRIP_DEMAND': value = 300 + Math.floor(Math.random() * 100); break;
      }
      
      forecastData.push({
        label: months[i],
        value: Math.round(value),
        confidence: 85 + Math.floor(Math.random() * 10)
      });
    }

    return {
      category,
      data: forecastData
    };
  }
}
