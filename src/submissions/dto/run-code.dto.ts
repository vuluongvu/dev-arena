import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SupportedLanguage } from '../../common/enums/supported-language.enum.js';

export class RunCodeDto {
  @IsEnum(SupportedLanguage)
  language: SupportedLanguage;

  @IsString()
  @IsNotEmpty()
  sourceCode: string;

  @IsString()
  input: string;
}
