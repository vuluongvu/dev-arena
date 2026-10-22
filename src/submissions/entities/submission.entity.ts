import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupportedLanguage } from '../../common/enums/supported-language.enum.js';
import { SubmissionStatus } from '../../common/enums/submission-status.enum.js';
import { User } from '../../users/entities/user.entity.js';
import { Problem } from '../../problems/entities/problem.entity.js';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  // user -> submissions
  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // problem -> submissions
  @ManyToOne(() => Problem, (problem) => problem.submissions)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({ type: 'enum', enum: SupportedLanguage })
  language: SupportedLanguage;

  @Column({ type: 'mediumtext' })
  sourceCode: string;

  @Column({ type: 'enum', enum: SubmissionStatus })
  submissionStatus: SubmissionStatus;

  @Column({ default: 0 })
  passedTestCases: number;

  @Column({ default: 0 })
  totalTestCases: number;

  @Column()
  executionTimeMs: number;

  @Column()
  memoryUsedKb: number;

  @CreateDateColumn()
  submittedAt: Date;
}
