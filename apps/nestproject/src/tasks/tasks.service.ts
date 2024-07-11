import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Task } from "./tasks.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { TaskState } from "apps/nestproject/src/tasksState/tasksState.entity";
import { CreateTaskDto } from "./dto/taskDto";
import { JwtService } from "@nestjs/jwt";
import { TaskFieldValue } from "apps/nestproject/src/task-fields/task-field-values.entity";
import { TaskField } from "apps/nestproject/src/task-fields/task-fields.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskFieldValue)
    private taskFieldValueRepository: Repository<TaskFieldValue>,
    private dataSource: DataSource,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(TaskState)
    private taskStateRepository: Repository<TaskState>,
    private jwtService: JwtService
  ) {}

  async createTask(dto: CreateTaskDto, params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const newTask = this.taskRepository.create(dto);
    const { project, state } = params;

    const currentProject = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.tasksState", "tasksState")
      .where("project.id = :id", { id: project })
      .andWhere("project.creatorId = :creator", { creator: user.id })
      .andWhere("tasksState.id = :taskState", { taskState: state })
      .getOne();

    if (currentProject) {
      newTask.state = currentProject.tasksState[0];
      await this.taskRepository.save(newTask);
      await this.addOrder(state, newTask.id);
    } else {
      throw new HttpException(
        "Проект или состояние с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    params.target = newTask.id;
    if (dto.customFields) {
      await this.addCustomField(dto.customFields, newTask, project);
    }
    return await this.findTask(params, head);
  }

  async addCustomField(fields, task, project) {
    let resultFields = await this.createArrayOfFields(fields, task, project);

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(TaskFieldValue)
      .values(resultFields)
      .execute();
  }

  async createArrayOfFields(fields, task, project) {
    let keys = Object.keys(fields);

    const currentFields = await this.dataSource
      .getRepository(TaskField)
      .createQueryBuilder("fields")
      .leftJoinAndSelect("fields.selectValues", "selectiveFieldValues")
      .where("fields.projectId = :projectId", { projectId: project })
      .andWhere("fields.name IN (:...names)", { names: keys })
      .getMany();

    let resultFields = [];

    for (let key in fields) {
      for (let i = 0; i < currentFields.length; i++) {
        if (key === currentFields[i].name) {
          if (!currentFields[i].selectValues) {
            if (currentFields[i].fieldType === typeof fields[key]) {
              resultFields.push({
                value: fields[key],
                field: currentFields[i],
                task: task,
              });
              break;
            }
          } else {
            if (
              currentFields[i].selectValues.values.indexOf(fields[key]) !== -1
            ) {
              resultFields.push({
                value: fields[key],
                field: currentFields[i],
                task: task,
              });
              break;
            }
          }
        }
      }
    }

    return resultFields;
  }

  async addOrder(index, id) {
    const state = await this.taskStateRepository.findOne({
      where: { id: index },
      relations: { project: true },
    });

    if (!state.tasksOrder) {
      state.tasksOrder = [id];
      await this.taskStateRepository.save(state);
    } else {
      state.tasksOrder.push(id);
      await this.taskStateRepository.save(state);
    }
  }

  async updateTask(dto: CreateTaskDto, params, head) {
    const newTask = this.taskRepository.create(dto);
    const { project, state, target } = params;
    const oldTask = await this.findTask(params, head);

    this.taskRepository.merge(oldTask, newTask);
    await this.taskRepository.save(oldTask);

    if (dto.customFields) {
      await this.updateCustomField(dto.customFields, oldTask, project);
      return await this.findTask(params, head);
    } else {
      return oldTask;
    }
  }

  async updateCustomField(fields, task, project) {
    let resultFields = await this.createArrayOfFields(fields, task, project);

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(TaskFieldValue)
      .values(resultFields)
      .orUpdate(["value"], ["taskId", "fieldId"])
      .execute();
  }

  async findTasks(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, state } = params;

    const tasks = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.tasksState", "tasksState")
      .leftJoinAndSelect("tasksState.tasks", "tasks")
      .leftJoinAndSelect("tasks.fieldValue", "fieldValue")
      .where("project.id = :id", { id: project })
      .andWhere("project.creatorId = :creator", { creator: user.id })
      .andWhere("tasksState.id = :taskState", { taskState: state })
      .getMany();

    if (tasks.length === 0) {
      throw new HttpException(
        "Проект или состояние с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    return tasks[0].tasksState[0].tasks;
  }

  async findTask(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, state, target } = params;

    const tasks = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.tasksState", "tasksState")
      .leftJoinAndSelect("tasksState.tasks", "tasks")
      .leftJoinAndSelect("tasks.fieldValue", "fieldValue")
      .where("project.id = :id", { id: project })
      .andWhere("project.creatorId = :creator", { creator: user.id })
      .andWhere("tasksState.id = :taskState", { taskState: state })
      .andWhere("tasks.id = :task", { task: target })
      .getOne();

    if (!tasks) {
      throw new HttpException(
        "Один из параметров указан неверно",
        HttpStatus.BAD_REQUEST
      );
    }
    return tasks.tasksState[0].tasks[0];
  }

  async deleteTask(params, head) {
    const { project, state, target } = params;

    const currentTask = await this.findTask(params, head);
    if (!currentTask) {
      throw new HttpException(
        "Задача с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const result = await this.taskRepository.delete({
      id: target,
    });
    await this.deleteTaskOrder(state, target);
    return;
  }

  async deleteTaskOrder(index, task) {
    const state = await this.taskStateRepository.findOne({
      where: { id: index },
      relations: { project: true },
    });

    const place = state.tasksOrder.indexOf(task.toString());
    state.tasksOrder.splice(place, 1);
    await this.taskStateRepository.save(state);
  }

  async dragTask(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, state, target, place } = params;

    const currentProject = await this.projectRepository.findOne({
      where: { id: project, creatorId: user.id },
    });

    if (!currentProject) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const currentState = await this.taskStateRepository.findOne({
      where: { id: state },
    });

    if (!currentState) {
      throw new HttpException(
        "Состояние с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const oldPlace = currentState.tasksOrder.indexOf(target.toString());

    if (oldPlace === -1) {
      throw new HttpException(
        "Задача с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    if (currentState.tasksOrder.length < place) {
      currentState.tasksOrder.splice(oldPlace, 1);
      currentState.tasksOrder.push(target);
    } else {
      currentState.tasksOrder.splice(oldPlace, 1);
      currentState.tasksOrder.splice(place, 0, target);
    }
    await this.taskStateRepository.save(currentState);
    return currentState;
  }
}
