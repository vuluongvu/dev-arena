import { PartialType } from '@nestjs/mapped-types';
import { CreateProblemDto } from './create-problem.dto.js';

export class UpdateProblemDto extends PartialType(CreateProblemDto) {}
