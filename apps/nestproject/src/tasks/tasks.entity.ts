import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { TaskState } from "../tasksState/tasksState.entity";
import { ApiProperty } from "@nestjs/swagger";
import { TaskFieldValue } from "apps/nestproject/src/task-fields/task-field-values.entity";

@Entity("Tasks")
export class Task {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор задачи",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Task",
    description: "Название задачи",
  })
  @Column()
  name: string;

  @ApiProperty({
    example: "Task description",
    description: "Описание задачи",
  })
  @Column()
  description: string;

  @ApiProperty({
    example: "Date",
    description: "Дата создания задачи",
  })
  @CreateDateColumn()
  created?: Date;

  @ManyToOne(() => TaskState, (state) => state.tasks, {
    onDelete: "CASCADE",
  })
  state: TaskState;

  @OneToMany(() => TaskFieldValue, (value) => value.task, {
    eager: true,
    onDelete: "CASCADE",
  })
  fieldValue: TaskFieldValue[];
}
