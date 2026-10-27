import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Judge0Service } from './services/judge0.service.js';
import { SubmissionsService } from './submissions.service.js';
import { RunCodeDto } from './dto/run-code.dto.js';
import { SubmitCodeDto } from './dto/submit-code.dto.js';

@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly judge0Service: Judge0Service,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Get('languages')
  getLanguages() {
    return this.judge0Service.getLanguages();
  }

  // run user's code (not user's submission)
  @Post('run')
  runCode(@Body() dto: RunCodeDto) {
    return this.judge0Service.createSubmission(
      dto.language,
      dto.sourceCode,
      dto.input,
    );
  }

  // submit and run test cases
  @Post('submit')
  submitCode(@Body() dto: SubmitCodeDto) {
    return this.submissionsService.evaluateCode(
      dto.problemId,
      dto.language,
      dto.sourceCode,
    );
  }

  // get submission by token
  @Get(':token/result')
  getSubmissionResult(@Param('token') token: string) {
    return this.judge0Service.getSubmission(token);
  }
}
