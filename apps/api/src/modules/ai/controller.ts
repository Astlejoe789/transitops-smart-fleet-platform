/**
 * Ai Controller
 *
 * Handles HTTP requests for the AI Insights and Predictive Intelligence module.
 */
import { Response } from 'express';
import { AiService } from './service.js';
import { AuthenticatedRequest } from '../../middlewares/index.js';

export class AiController {
  private aiService: AiService;

  constructor() {
    this.aiService = new AiService();
  }

  getDashboardMetrics = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const metrics = await this.aiService.getDashboardMetrics(companyId, userId);
      return res.status(200).json({ success: true, data: metrics });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  getInsights = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const insights = await this.aiService.getInsights(companyId, userId);
      return res.status(200).json({ success: true, data: insights });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  askQuestion = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const { question } = req.body;
      
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      
      if (!question) {
        return res.status(400).json({ success: false, error: 'Question is required' });
      }

      const answer = await this.aiService.askQuestion(companyId, userId, question);
      return res.status(200).json({ success: true, data: answer });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
}

