import { prisma } from '../../database/prisma.js';

export class SettingsService {
  async getSettings(companyId: string) {
    return prisma.setting.findMany({ where: { companyId } });
  }

  async updateSettings(companyId: string, category: string, settings: Record<string, any>) {
    const results = [];
    for (const [key, value] of Object.entries(settings)) {
      const updated = await prisma.setting.upsert({
        where: { companyId_category_key: { companyId, category, key } },
        update: { value },
        create: { companyId, category, key, value },
      });
      results.push(updated);
    }
    return results;
  }
}

export const settingsService = new SettingsService();
