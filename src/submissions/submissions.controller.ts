
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Judge0Service } from './services/judge0.service.js';
import { RunCodeDto } from './dto/run-code.dto.js';

@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly judge0Service: Judge0Service,
  ) {}

  @Get('languages')
  getLanguages() {
    return this.judge0Service.getLanguages();
  }

  @Post('run')
  runCode(@Body() dto: RunCodeDto) {
    return this.judge0Service.createSubmission(
      dto.language,
      dto.sourceCode,
      dto.input,
    );
  }

  @Get(':token/result')
  getSubmissionResult(@Param('token') token: string) {
    return this.judge0Service.getSubmission(token);
  }
}
