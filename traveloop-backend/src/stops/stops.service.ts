import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StopsService {
  constructor(private prisma: PrismaService) {}

  async getStops(tripId: string) {
    return this.prisma.stop.findMany({
      where: { tripId },
      orderBy: { orderIndex: 'asc' },
      include: { city: true, activities: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async addStop(tripId: string, dto: { cityName: string; country: string; arrivalDate: string; departureDate: string }) {
    // Upsert city
    let city = await this.prisma.city.findFirst({ where: { name: dto.cityName, country: dto.country } });
    if (!city) {
      city = await this.prisma.city.create({
        data: { name: dto.cityName, country: dto.country, lat: 0, lng: 0 },
      });
    }

    const count = await this.prisma.stop.count({ where: { tripId } });
    return this.prisma.stop.create({
      data: {
        tripId,
        cityId: city.id,
        arrivalDate: new Date(dto.arrivalDate),
        departureDate: new Date(dto.departureDate),
        orderIndex: count,
      },
      include: { city: true, activities: true },
    });
  }

  async deleteStop(id: string) {
    return this.prisma.stop.delete({ where: { id } });
  }
}
