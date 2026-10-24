import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { SubmissionsController } from './submissions.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
