import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Difficulty } from '../../common/enums/difficulty.enum.js';
import { ProblemStatus } from '../../common/enums/problem-status.enum.js';
import { Submission } from '../../submissions/entities/submission.entity.js';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: Difficulty })
  difficulty: Difficulty;

  @Column()
  statement: string;

  @Column()
  timeLimitMs: number;

  @Column()
  memoryLimitMb: number;

  @Column({ type: 'enum', enum: ProblemStatus })
  problemStatus: ProblemStatus;

  // problem -> submissions
  @OneToMany(() => Submission, (submission) => submission.problem, {
    cascade: true,
  })
  submissions: Submission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
