import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column('text')
  @ApiProperty()
  content: string;

  @Column('text', { array: true, default: [] })
  @ApiProperty({ type: [String] })
  tags: string[];

  @ManyToOne(() => User, { eager: true })
  @ApiProperty({ type: () => User })
  author: User;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
