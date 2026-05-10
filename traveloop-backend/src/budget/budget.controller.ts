import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Budget')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  @ApiOperation({ summary: 'Get budget and spending for a trip' })
  async getBudget(@Param('tripId') tripId: string) {
    const data = await this.budgetService.getBudget(tripId);
    return { success: true, message: 'Budget fetched', data };
  }

  @Post()
  @ApiOperation({ summary: 'Set or update budget for a trip' })
  async upsertBudget(@Param('tripId') tripId: string, @Body() dto: any) {
    const data = await this.budgetService.upsertBudget(tripId, dto);
    return { success: true, message: 'Budget saved', data };
  }
}
