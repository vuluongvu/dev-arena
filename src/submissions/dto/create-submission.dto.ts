import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { SupportedLanguage } from '../../common/enums/supported-language.enum.js';

export class CreateSubmissionDto {
  @IsInt({ message: 'Problem ID must be an integer' })
  @IsPositive({ message: 'Problem ID must be a positive number' })
  problemId: number;

  @IsEnum(SupportedLanguage, {
    message: 'Unsupported programming language',
  })
  language: SupportedLanguage;

  @IsString({ message: 'Source code must be a string' })
  @IsNotEmpty({ message: 'Source code must not be empty' })
  @MaxLength(100_000, {
    message: 'Source code must not exceed 100,000 characters',
  })
  sourceCode: string;
}
