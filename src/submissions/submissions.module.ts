import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { SubmissionsController } from './submissions.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity.js';
import { Judge0Service } from './services/judge0.service.js';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), HttpModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, Judge0Service],
})
export class SubmissionsModule {}
