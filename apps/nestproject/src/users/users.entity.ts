import { ApiProperty } from "@nestjs/swagger";
import { Role } from "apps/nestproject/src/roles/roles.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";

@Entity("Users")
export class User {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор пользователя",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "qwert", description: "Емаил пользователя" })
  @Column()
  email: string;

  @ApiProperty({ example: "1234", description: "Пароль пользователя" })
  @Column()
  password: string;

  @ApiProperty({ example: "true", description: "Статус пользователя" })
  @Column({ default: true })
  isActive: boolean;

  // @ManyToMany(() => Role, {
  //   cascade: true,
  // })
  // @JoinTable()
  // roles: Role[];
}
