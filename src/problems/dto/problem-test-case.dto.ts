import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ProblemTestCaseItemDto {
  @IsString()
  @MaxLength(100_000, {
    message: 'Input must not exceed 100,000 characters',
  })
  input: string;

  @IsString()
  @MaxLength(100_000, {
    message: 'Expected output must not exceed 100,000 characters',
  })
  expectedOutput: string;

  @IsOptional()
  @IsBoolean({ message: 'Sample must be true or false' })
  isSample?: boolean;
}
