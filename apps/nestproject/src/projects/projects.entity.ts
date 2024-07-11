import { ApiProperty } from "@nestjs/swagger";
import { TaskField } from "apps/nestproject/src/task-fields/task-fields.entity";
import { TaskState } from "apps/nestproject/src/tasksState/tasksState.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

@Entity("Projects")
export class Project {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор проекта",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "CRUD сервер",
    description: "Уникальное название проекта",
  })
  @Column()
  name: string;

  @ApiProperty({
    example: "Супер крутое описание",
    description: "Описание проекта",
  })
  @Column()
  description: string;

  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор юзера, создавшего проект",
  })
  @Column({ type: "integer" })
  creatorId: number;

  @ApiProperty({
    example: "[1,2,3,4]",
    description: "Список с порядком столбцов состояний",
  })
  @Column("simple-array", { nullable: true })
  statesOrder: number[];

  @ApiProperty({
    example: "2024-06-18T07:23:58.156Z",
    description: "Дата создания проекта",
  })
  @CreateDateColumn()
  created?: Date;

  @OneToMany(() => TaskState, (state) => state.project, {
    onDelete: "CASCADE",
  })
  tasksState: TaskState[];

  @OneToMany(() => TaskField, (field) => field.project, {
    onDelete: "CASCADE",
  })
  taskField: TaskField[];
}
