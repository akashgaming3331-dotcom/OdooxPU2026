import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/trips.dto';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isPublic: dto.isPublic || false,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        stops: { include: { city: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id, userId },
      include: {
        stops: {
          include: { city: true, activities: true },
          orderBy: { orderIndex: 'asc' },
        },
        budget: true,
        notes: { orderBy: { updatedAt: 'desc' } },
        checklists: true,
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async updateTrip(id: string, userId: string, dto: any) {
    await this.findOne(id, userId);
    return this.prisma.trip.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
        isPublic: dto.isPublic,
      },
    });
  }

  async deleteTrip(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.trip.delete({ where: { id } });
  }
}
