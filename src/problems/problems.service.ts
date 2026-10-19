import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity.js';
import { Repository } from 'typeorm';
import { generateSlug } from '../common/utils/generate-slug.util.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { UpdateProblemDto } from './dto/update-problem.dto.js';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  // function: find one problem by slug
  async findOneBySlug(slug: string): Promise<Problem | null> {
    return this.problemRepository.findOne({
      where: { slug },
    });
  }

  // function: create problem
  async createProblem(dto: CreateProblemDto): Promise<Problem> {
    const slug = generateSlug(dto.title);

    const existingProblem = await this.findOneBySlug(slug);

    if (existingProblem) {
      throw new ConflictException('Problem slug already exists');
    }

    const problem = this.problemRepository.create({
      ...dto,
      slug,
    });

    try {
      return await this.problemRepository.save(problem);
    } catch (error) {
      // Database unique constraint is still the last protection.
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Problem slug already exists');
      }

      throw error;
    }
  }

  // function: find all
  async findAll(): Promise<Problem[]> {
    return this.problemRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // function: find one problem
  async findOne(slug: string): Promise<Problem> {
    const problem = await this.problemRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!problem) {
      throw new NotFoundException(`Problem with slug ${slug} not found`);
    }

    return problem;
  }

  // function: update problem
  async updateProblem(slug: string, dto: UpdateProblemDto): Promise<Problem> {
    const problem = await this.findOne(slug);

    if (dto.title !== undefined) {
      const newSlug = generateSlug(dto.title);

      if (newSlug !== problem.slug) {
        const existingProblem = await this.findOneBySlug(newSlug);

        if (existingProblem) {
          throw new ConflictException('Problem slug already exists');
        }

        problem.slug = newSlug;
      }
    }

    Object.assign(problem, dto);

    try {
      return await this.problemRepository.save(problem);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Problem slug already exists');
      }

      throw error;
    }
  }

  // function: delete problem
  async deleteProblem(slug: string): Promise<{ message: string }> {
    const result = await this.problemRepository.delete({ slug });

    if (result.affected === 0) {
      throw new NotFoundException('Problem not found');
    }

    return {
      message: 'Problem deleted successfully',
    };
  }
}
