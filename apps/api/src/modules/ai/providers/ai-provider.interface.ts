export interface AiInsight {
  title: string;
  description: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
  metricValue?: string;
}

export interface AiForecast {
  category: string;
  data: any[];
}

export interface IAiProvider {
  /**
   * Initialize the provider with API keys or configurations.
   */
  initialize(config: Record<string, any>): void;

  /**
   * Ask a natural language question and receive an intelligent response.
   */
  askQuestion(question: string, contextData?: any): Promise<string>;

  /**
   * Generate high-level insights based on a set of provided operational data.
   */
  generateInsights(data: any): Promise<AiInsight[]>;

  /**
   * Generate predictive forecasts based on historical data.
   */
  generateForecast(category: 'MAINTENANCE' | 'FUEL' | 'REVENUE' | 'EXPENSE' | 'TRIP_DEMAND', historicalData: any): Promise<AiForecast>;
}
