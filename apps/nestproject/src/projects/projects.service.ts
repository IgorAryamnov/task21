import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "./projects.entity";
import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/projectDto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private jwtService: JwtService
  ) {}

  async createProject(dto: CreateProjectDto, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const newProject = this.projectRepository.create(dto);
    newProject.creatorId = user.id;
    await this.projectRepository.save(newProject);
    return newProject;
  }

  async findAll(head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const projects = await this.projectRepository.find({
      where: { creatorId: user.id },
    });
    return projects;
  }

  async findProject(id: number, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const project = await this.projectRepository.find({
      where: { creatorId: user.id, id: id },
    });
    if (project.length === 0) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    return project;
  }

  async deleteProject(id: number, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const result = await this.projectRepository.delete({
      id: id,
      creatorId: user.id,
    });
    if (result.affected === 0) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    return;
  }

  async update(id: number, dto: CreateProjectDto, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const project = await this.projectRepository.findOne({
      where: { id: id, creatorId: user.id },
    });
    if (!project) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    this.projectRepository.merge(project, dto);
    await this.projectRepository.save(project);
    return project;
  }
}
