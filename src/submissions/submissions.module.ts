import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { SubmissionsController } from './submissions.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity.js';
import { Judge0Service } from './services/judge0.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, Judge0Service],
})
export class SubmissionsModule {}
