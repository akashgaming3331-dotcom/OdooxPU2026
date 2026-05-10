import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getNotes(@Param('tripId') tripId: string) {
    const data = await this.notesService.getNotes(tripId);
    return { success: true, message: 'Notes fetched', data };
  }

  @Post()
  async createNote(@Param('tripId') tripId: string, @Body() dto: any) {
    const data = await this.notesService.createNote(tripId, dto);
    return { success: true, message: 'Note created', data };
  }

  @Put(':id')
  async updateNote(@Param('id') id: string, @Body() dto: any) {
    const data = await this.notesService.updateNote(id, dto);
    return { success: true, message: 'Note updated', data };
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string) {
    await this.notesService.deleteNote(id);
    return { success: true, message: 'Note deleted' };
  }
}
