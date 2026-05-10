import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackingService {
  constructor(private prisma: PrismaService) {}

  async getItems(tripId: string) {
    return this.prisma.packingChecklist.findMany({
      where: { tripId },
      orderBy: { category: 'asc' },
    });
  }

  async addItem(tripId: string, dto: { itemName: string; category?: string }) {
    return this.prisma.packingChecklist.create({
      data: { tripId, itemName: dto.itemName, category: dto.category },
    });
  }

  async toggleItem(id: string, isPacked: boolean) {
    return this.prisma.packingChecklist.update({
      where: { id },
      data: { isPacked },
    });
  }

  async deleteItem(id: string) {
    return this.prisma.packingChecklist.delete({ where: { id } });
  }
}
