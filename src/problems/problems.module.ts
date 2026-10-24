import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service.js';
import { ProblemsController } from './problems.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity.js';
import { ProblemTestCase } from './entities/problem-test-case.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, ProblemTestCase])],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule {}
