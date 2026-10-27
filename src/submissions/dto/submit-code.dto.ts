import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { SupportedLanguage } from '../../common/enums/supported-language.enum.js';

export class SubmitCodeDto {
  @IsInt()
  @Min(1)
  problemId: number;

  @IsEnum(SupportedLanguage)
  language: SupportedLanguage;

  @IsString()
  @IsNotEmpty()
  sourceCode: string;
}
