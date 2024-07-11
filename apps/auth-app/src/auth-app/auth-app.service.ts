import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UserDto } from "./dto/createUser.dto";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthAppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private jwtService: JwtService
  ) {}

  async login(userDto: UserDto) {
    const user = await this.validateUser(userDto);
    if (user) {
      return this.generateToken(user);
    }
    return false;
  }

  private async validateUser(userDto: UserDto) {
    const user = await this.dataSource
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.email = :email", { email: userDto.email })
      .getOne();

    if (!user) {
      return false;
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );

    if (passwordEquals) {
      return user;
    }

    return false;
  }

  async registration(userDto: UserDto) {
    const candidate = await this.dataSource
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.email = :email", { email: userDto.email })
      .getOne();

    if (candidate) {
      return false;
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = this.usersRepository.create({
      ...userDto,
      password: hashPassword,
    });

    await this.usersRepository.save(user);

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
