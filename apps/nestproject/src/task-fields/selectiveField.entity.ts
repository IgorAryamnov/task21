import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { TaskField } from "./task-fields.entity";

@Entity("SelectiveFieldValues")
export class SelectiveFieldValues {
  @PrimaryColumn({ name: "fieldId", type: "number" })
  @OneToOne(() => TaskField, (field) => field.selectValues, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "fieldId" })
  field!: TaskField;

  @ApiProperty({
    example: "string",
    description: "Значение поля задачи",
  })
  @Column({ type: "simple-array" })
  values: string[];
}
