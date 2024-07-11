import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DataSource, Repository } from "typeorm";
import { TaskField } from "./task-fields.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { CreateFieldDto } from "./dto/taskFieldsDto";
import { SelectiveFieldValues } from "./selectiveField.entity";

@Injectable()
export class TaskFieldsService {
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
    @InjectRepository(TaskField)
    private taskFieldRepository: Repository<TaskField>,
    @InjectRepository(SelectiveFieldValues)
    private selectRepository: Repository<SelectiveFieldValues>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async createField(dto: CreateFieldDto, project, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const newField = this.taskFieldRepository.create(dto);

    const currentProject = await this.projectRepository.findOne({
      where: { id: project, creatorId: user.id },
    });

    if (!currentProject) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    newField.project = currentProject;
    await this.taskFieldRepository.save(newField);

    if (newField.fieldType === "select") {
      //на фронте должна быть проверка что поле заполнено хоть чем-то
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(SelectiveFieldValues)
        .values({
          field: newField,
          values: dto.selectiveValues,
        })
        .execute();
    }
    return newField;
  }

  async findAllFields(project, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);

    const fields = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.taskField", "taskField")
      .leftJoinAndSelect("taskField.selectValues", "selectiveFieldValues")
      .where("project.creatorId = :creatorId", { creatorId: user.id })
      .andWhere("project.id = :id", { id: project })
      .getMany();

    if (fields.length === 0) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    return fields[0].taskField;
  }

  async findField(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, field } = params;

    const currentField = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.taskField", "taskField")
      .leftJoinAndSelect("taskField.selectValues", "selectiveFieldValues")
      .where("project.creatorId = :creatorId", { creatorId: user.id })
      .andWhere("project.id = :id", { id: project })
      .andWhere("taskField.id = :taskFieldId", { taskFieldId: field })
      .getOne();

    if (!currentField) {
      throw new HttpException(
        "Проект или поле с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    return currentField.taskField[0];
  }

  async deleteField(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, field } = params;

    const currentProject = await this.projectRepository.findOne({
      where: { id: project, creatorId: user.id },
    });

    if (!currentProject) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(TaskField)
      .where("id = :id", { id: field })
      .andWhere("projectId = :projectId", { projectId: project })
      .execute();

    if (result.affected === 0) {
      throw new HttpException(
        "Поля с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateField(fieldDto: CreateFieldDto, params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, field } = params;

    const currentProject = await this.projectRepository.findOne({
      where: { id: project, creatorId: user.id },
    });

    if (!currentProject) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const currentField = this.taskFieldRepository.create(fieldDto);

    const result = await this.dataSource
      .createQueryBuilder()
      .update(TaskField)
      .set(currentField)
      .where("id = :id", { id: field })
      .andWhere("projectId = :projectId", { projectId: project })
      .execute();

    if (result.affected === 0) {
      throw new HttpException(
        "Поля с таким id не существует либо данные не изменились",
        HttpStatus.BAD_REQUEST
      );
    } else {
      const newField = await this.findField(params, head);

      if (newField.fieldType === "select" && fieldDto.selectiveValues) {
        await this.selectRepository.save({
          field: newField,
          values: fieldDto.selectiveValues,
        });
      }

      if (newField.fieldType !== "select" && newField.selectValues) {
        await this.selectRepository.delete({ field: newField });
      }

      return await this.findField(params, head);
    }
  }
}
