import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "./users.entity";

@Entity("Roles")
export class Role {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор пользователя",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "ADMIN", description: "Уникальное значение роли" })
  @Column({ unique: true })
  value: string;

  @ApiProperty({ example: "Администратор", description: "Описание роли" })
  @Column()
  description: string;

  @ManyToMany(() => User)
  users: User[];
}
