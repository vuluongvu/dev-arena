import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProblemsService } from './problems.service.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { UpdateProblemDto } from './dto/update-problem.dto.js';
import { Role } from '../common/enums/role.enum.js';
import { Auth } from '../auth/decorators/auth.decorator.js';

@ApiTags('Problems')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a problem' })
  @ApiResponse({ status: 201, description: 'Problem created successfully' })
  @ApiResponse({ status: 409, description: 'Problem slug already exists' })
  @Auth(Role.ADMIN)
  create(@Body() dto: CreateProblemDto) {
    return this.problemsService.createProblem(dto);
  }

  @Get()
  findAll() {
    return this.problemsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.problemsService.findOne(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateProblemDto) {
    return this.problemsService.updateProblem(slug, dto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.problemsService.deleteProblem(slug);
  }
}
