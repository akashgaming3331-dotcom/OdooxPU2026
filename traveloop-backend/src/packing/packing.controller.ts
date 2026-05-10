import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PackingService } from './packing.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Packing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Get()
  async getItems(@Param('tripId') tripId: string) {
    const data = await this.packingService.getItems(tripId);
    return { success: true, message: 'Packing items fetched', data };
  }

  @Post()
  async addItem(@Param('tripId') tripId: string, @Body() dto: any) {
    const data = await this.packingService.addItem(tripId, dto);
    return { success: true, message: 'Item added', data };
  }

  @Patch(':id/toggle')
  async toggleItem(@Param('id') id: string, @Body() dto: { isPacked: boolean }) {
    const data = await this.packingService.toggleItem(id, dto.isPacked);
    return { success: true, message: 'Item updated', data };
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: string) {
    await this.packingService.deleteItem(id);
    return { success: true, message: 'Item deleted' };
  }
}
