import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Task } from "../tasks/tasks.entity";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("TaskState")
export class TaskState {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор состояния задачи",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "To do",
    description: "Названия состояния задачи",
  })
  @Column()
  name: string;

  @ApiProperty({
    example: "[1,2,3,4]",
    description: "Порядок расположения столбцов состояний задач",
  })
  @Column("simple-array", { nullable: true })
  tasksOrder: number[];

  @OneToMany(() => Task, (task) => task.state, {
    eager: true,
  })
  tasks: Task[];

  @ManyToOne(() => Project, (project) => project.tasksState, {
    onDelete: "CASCADE",
  })
  project: Project;
}
