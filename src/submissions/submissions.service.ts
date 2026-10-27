import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProblemTestCase } from '../problems/entities/problem-test-case.entity.js';
import { SupportedLanguage } from '../common/enums/supported-language.enum.js';
import { Judge0Service } from './services/judge0.service.js';
import { SubmissionStatus } from '../common/enums/submission-status.enum.js';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(ProblemTestCase)
    private readonly testCaseRepository: Repository<ProblemTestCase>,
    private readonly judge0Service: Judge0Service,
  ) {}

  async getTestCasesByProblemId(problemId: number): Promise<ProblemTestCase[]> {
    if (!Number.isInteger(problemId) || problemId <= 0) {
      throw new BadRequestException('Invalid problem ID');
    }

    const testCases = await this.testCaseRepository
      .createQueryBuilder('testCase')
      .innerJoin('testCase.problem', 'problem')
      .where('problem.id = :problemId', { problemId })
      .orderBy('testCase.orderIndex', 'ASC')
      .addOrderBy('testCase.id', 'ASC')
      .getMany();

    if (testCases.length === 0) {
      throw new NotFoundException('Cannot find any test cases');
    }

    return testCases;
  }

  async evaluateCode(
    problemId: number,
    language: SupportedLanguage,
    sourceCode: string,
  ) {
    const testCases = await this.getTestCasesByProblemId(problemId);

    let passedTestCases = 0;
    let totalExecutionTimeMs = 0;

    for (const testCase of testCases) {
      const result = await this.judge0Service.createSubmission(
        language,
        sourceCode,
        testCase.input,
      );

      if (result.status.id === 5) {
        return {
          status: SubmissionStatus.TIME_LIMIT_EXCEEDED,
          passedTestCases,
          totalTestCases: testCases.length,
        };
      }

      if (result.status.id === 6) {
        return {
          status: SubmissionStatus.COMPILATION_ERROR,
          passedTestCases,
          totalTestCases: testCases.length,
          compileOutput: result.compile_output,
        };
      }

      if (result.status.id !== 3) {
        return {
          status: SubmissionStatus.RUNTIME_ERROR,
          passedTestCases,
          totalTestCases: testCases.length,
          message: result.stderr ?? result.message,
        };
      }

      totalExecutionTimeMs += Math.round(Number(result.time ?? 0) * 1000);

      const actualOutput = this.normalizeOutput(result.stdout ?? '');
      const expectedOutput = this.normalizeOutput(testCase.expectedOutput);

      if (actualOutput !== expectedOutput) {
        return {
          status: SubmissionStatus.WRONG_ANSWER,
          passedTestCases,
          totalTestCases: testCases.length,
          executionTimeMs: totalExecutionTimeMs,
        };
      }

      passedTestCases++;
    }

    return {
      status: SubmissionStatus.ACCEPTED,
      passedTestCases,
      totalTestCases: testCases.length,
      executionTimeMs: totalExecutionTimeMs,
    };
  }

  private normalizeOutput(output: string): string {
    return output.replace(/\r\n/g, '\n').trim();
  }
}
