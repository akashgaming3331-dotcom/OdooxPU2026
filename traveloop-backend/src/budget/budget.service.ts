import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async getBudget(tripId: string) {
    const budget = await this.prisma.budget.findUnique({ where: { tripId } });
    // Also compute total spent from activities
    const activities = await this.prisma.activity.findMany({
      where: { stop: { tripId } },
      select: { cost: true },
    });
    const spent = activities.reduce((sum, a) => sum + (a.cost || 0), 0);
    return { ...budget, spent };
  }

  async upsertBudget(tripId: string, dto: { totalLimit: number; currency?: string }) {
    return this.prisma.budget.upsert({
      where: { tripId },
      update: { totalLimit: dto.totalLimit, currency: dto.currency || 'INR' },
      create: { tripId, totalLimit: dto.totalLimit, currency: dto.currency || 'INR' },
    });
  }
}
