import {
  Injectable,
  GatewayTimeoutException,
  BadGatewayException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SupportedLanguage } from '../../common/enums/supported-language.enum.js';
import { JUDGE0_LANGUAGE_IDS } from '../constant/judge0-language-ids.constant.js';

export interface Judge0Submission {
  token: string;
}

export interface Judge0Result {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
}

@Injectable()
export class Judge0Service {
  private readonly judge0Url: string;
  private readonly maxWaitMs = 10_000;
  private readonly pollIntervalMs = 500;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.judge0Url = configService
      .getOrThrow<string>('JUDGE0_URL')
      .replace(/\/+$/, '');
  }

  async getLanguages(): Promise<unknown> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.judge0Url}/languages`),
    );

    return response.data;
  }

  async createSubmission(
    language: SupportedLanguage,
    sourceCode: string,
    input: string,
  ): Promise<Judge0Result> {
    const languageId = JUDGE0_LANGUAGE_IDS[language];

    const response = await firstValueFrom(
      this.httpService.post<Judge0Submission>(
        `${this.judge0Url}/submissions`,
        {
          language_id: languageId,
          source_code: sourceCode,
          stdin: input,
        },
        {
          params: { base64_encoded: false },
        },
      ),
    );

    const { token } = response.data;

    if (!token) {
      throw new BadGatewayException('Judge0 did not return a submission token');
    }

    return this.waitForResult(token);
  }

  async getSubmission(token: string): Promise<Judge0Result> {
    const response = await firstValueFrom(
      this.httpService.get<Judge0Result>(
        `${this.judge0Url}/submissions/${encodeURIComponent(token)}`,
        {
          params: { base64_encoded: false },
        },
      ),
    );

    return response.data;
  }

  private async waitForResult(token: string): Promise<Judge0Result> {
    const deadline = Date.now() + this.maxWaitMs;

    while (Date.now() < deadline) {
      const result = await this.getSubmission(token);

      // Judge0 status 1 = In Queue, 2 = Processing.
      if (result.status.id !== 1 && result.status.id !== 2) {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, this.pollIntervalMs));
    }

    throw new GatewayTimeoutException(
      'Judge0 execution timed out. Try retrieving the result using the submission token.',
    );
  }
}
