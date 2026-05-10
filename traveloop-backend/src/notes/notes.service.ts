import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async getNotes(tripId: string) {
    return this.prisma.tripNote.findMany({
      where: { tripId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createNote(tripId: string, dto: { title: string; content: string }) {
    return this.prisma.tripNote.create({
      data: { tripId, title: dto.title, content: dto.content },
    });
  }

  async updateNote(id: string, dto: { title?: string; content?: string }) {
    return this.prisma.tripNote.update({
      where: { id },
      data: dto,
    });
  }

  async deleteNote(id: string) {
    return this.prisma.tripNote.delete({ where: { id } });
  }
}
