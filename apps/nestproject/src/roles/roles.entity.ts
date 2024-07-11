import { ApiProperty } from "@nestjs/swagger";
import { User } from "apps/nestproject/src/users/users.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";

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
