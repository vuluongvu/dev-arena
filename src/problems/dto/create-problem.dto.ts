import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Difficulty } from '../../common/enums/difficulty.enum.js';
import { ProblemStatus } from '../../common/enums/problem-status.enum.js';

export class CreateProblemDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsEnum(Difficulty, {
    message: 'Difficulty must be a valid difficulty level',
  })
  difficulty: Difficulty;

  @IsString({ message: 'Statement must be a string' })
  @IsNotEmpty({ message: 'Statement is required' })
  statement: string;

  @IsInt({ message: 'Time limit must be an integer' })
  @Min(1, { message: 'Time limit must be greater than 0' })
  timeLimitMs: number;

  @IsInt({ message: 'Memory limit must be an integer' })
  @Min(1, { message: 'Memory limit must be greater than 0' })
  memoryLimitMb: number;

  @IsEnum(ProblemStatus, {
    message: 'Problem status must be a valid status',
  })
  problemStatus: ProblemStatus;
}
