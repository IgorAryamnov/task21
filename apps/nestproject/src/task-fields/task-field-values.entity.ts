import { ApiProperty } from "@nestjs/swagger";
import { Task } from "apps/nestproject/src/tasks/tasks.entity";
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { TaskField } from "./task-fields.entity";

@Entity("TaskFieldValue")
export class TaskFieldValue {
  @PrimaryColumn({ name: "taskId", type: "number" })
  @ManyToOne(() => Task, (task) => task.fieldValue, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "taskId" })
  task!: Task;

  @PrimaryColumn({ name: "fieldId", type: "number" })
  @ManyToOne(() => TaskField, (field) => field.fieldValue, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "fieldId" })
  field!: TaskField;

  @ApiProperty({
    example: "string",
    description: "Значение поля задачи",
  })
  @Column()
  value: string;
}
