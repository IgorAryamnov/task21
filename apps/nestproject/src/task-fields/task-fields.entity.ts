import { ApiProperty } from "@nestjs/swagger";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { TaskFieldValue } from "./task-field-values.entity";
import { SelectiveFieldValues } from "./selectiveField.entity";

@Entity("TaskFields")
export class TaskField {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор поля задачи",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Field",
    description: "Название поля задачи",
  })
  @Column()
  name: string;

  @ApiProperty({
    example: "string",
    description: "Тип поля задачи",
  })
  @Column()
  fieldType: string;

  @ManyToOne(() => Project, (project) => project.taskField, {
    onDelete: "CASCADE",
  })
  project: Project;

  @OneToMany(() => TaskFieldValue, (value) => value.field, {
    onDelete: "CASCADE",
  })
  fieldValue: TaskFieldValue[];

  @OneToOne(() => SelectiveFieldValues, (select) => select.field, {
    onDelete: "CASCADE",
  })
  selectValues!: SelectiveFieldValues;
}
