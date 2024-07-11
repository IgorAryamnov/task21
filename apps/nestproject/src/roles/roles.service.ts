import { Injectable } from "@nestjs/common";
import { Role } from "./roles.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/createUser.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  async createRole(dto: CreateRoleDto) {
    const newRole = this.rolesRepository.create(dto);
    await this.rolesRepository.save(newRole);
    return newRole;
  }

  async findRole(value: string): Promise<Role | null> {
    const role = await this.rolesRepository.findOneBy({ value });
    return role;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.rolesRepository.find();
    return roles;
  }
}
