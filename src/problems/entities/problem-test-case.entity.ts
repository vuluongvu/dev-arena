import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { Problem } from './problem.entity.js';

@Entity('test_cases')
export class ProblemTestCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext' })
  input: string;

  @Column({ name: 'expected_output', type: 'mediumtext' })
  expectedOutput: string;

  @Column({ name: 'is_sample', type: 'boolean', default: false })
  isSample: boolean;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // problem -> testcases
  @ManyToOne(() => Problem, (problem) => problem.problemTestCase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'problem_id' })
  problem: Relation<Problem>;
}
