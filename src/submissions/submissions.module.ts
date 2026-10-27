import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { SubmissionsController } from './submissions.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity.js';
import { Judge0Service } from './services/judge0.service.js';
import { HttpModule } from '@nestjs/axios';
import { ProblemTestCase } from '../problems/entities/problem-test-case.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, ProblemTestCase]),
    HttpModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, Judge0Service],
})
export class SubmissionsModule {}
