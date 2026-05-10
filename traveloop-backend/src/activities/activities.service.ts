import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async getActivities(stopId: string) {
    return this.prisma.activity.findMany({
      where: { stopId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async addActivity(stopId: string, dto: { title: string; description?: string; cost?: number; location?: string; date?: string }) {
    const count = await this.prisma.activity.count({ where: { stopId } });
    return this.prisma.activity.create({
      data: {
        stopId,
        title: dto.title,
        description: dto.description,
        cost: dto.cost || 0,
        location: dto.location,
        date: dto.date ? new Date(dto.date) : null,
        orderIndex: count,
      },
    });
  }

  async deleteActivity(id: string) {
    return this.prisma.activity.delete({ where: { id } });
  }
}
