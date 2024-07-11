import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskState } from "./tasksState.entity";
import { DataSource, Repository } from "typeorm";
import { CreateTasksStateDto } from "./dto/tasksStateDto";
import { Project } from "apps/nestproject/src/projects/projects.entity";
import { JwtService } from "@nestjs/jwt";
import { Task } from "apps/nestproject/src/tasks/tasks.entity";
import { ParamsValidation } from "./paramsValidation";

@Injectable()
export class TasksStateService {
  constructor(
    @InjectRepository(TaskState)
    private taskStateRepository: Repository<TaskState>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private jwtService: JwtService,
    private dataSource: DataSource
  ) {}

  async createTaskState(dto: CreateTasksStateDto, project: number, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const newState = this.taskStateRepository.create(dto);
    const currentProject = await this.projectRepository.findOne({
      where: { id: project, creatorId: user.id },
    });

    if (!currentProject) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    newState.project = currentProject;
    await this.taskStateRepository.save(newState);
    await this.saveState(project, user, newState.id);
    return newState;
  }

  async saveState(id: number, user, stateId) {
    const project = await this.projectRepository.findOne({
      where: { id: id, creatorId: user.id },
    });

    if (!project.statesOrder) {
      project.statesOrder = [stateId];
      await this.projectRepository.save(project);
    } else {
      project.statesOrder.push(stateId);
      await this.projectRepository.save(project);
    }
  }

  async findAllStates(id, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);

    const currentStates = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.tasksState", "taskState")
      .leftJoinAndSelect("taskState.tasks", "tasks")
      .where("project.id = :id", { id: id })
      .andWhere("project.creatorId = :creator", { creator: user.id })
      .getMany();
    if (currentStates.length === 0) {
      throw new HttpException(
        "Один из параметров указан неверно",
        HttpStatus.BAD_REQUEST
      );
    }
    return currentStates[0].tasksState;
  }

  async findOneState(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, state } = params;

    const currentState = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.tasksState", "taskState")
      .leftJoinAndSelect("taskState.tasks", "tasks")
      .where("project.id = :id", { id: project })
      .andWhere("project.creatorId = :creator", { creator: user.id })
      .andWhere("taskState.id = :taskState", { taskState: state })
      .getOne();

    if (!currentState) {
      throw new HttpException(
        "Один из параметров указан неверно или состояня не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    return currentState.tasksState[0];
  }

  async deleteTaskState(params: ParamsValidation, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, state } = params;

    await this.findOneState(params, head);
    await this.taskStateRepository.delete({
      id: state,
    });
    await this.deleteState(project, user, state);
    return;
  }

  async deleteState(id: number, user, index) {
    const project = await this.projectRepository.findOne({
      where: { id: id, creatorId: user.id },
    });
    const place = project.statesOrder.indexOf(index.toString());
    project.statesOrder.splice(place, 1);
    await this.projectRepository.save(project);
  }

  async updateTaskState(
    params: ParamsValidation,
    stateDto: CreateTasksStateDto,
    head
  ) {
    const currentState = await this.findOneState(params, head);
    this.taskStateRepository.merge(currentState, stateDto);
    await this.taskStateRepository.save(currentState);
    return currentState;
  }

  async dragTaskBetweenStates(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, target, state, place } = params;

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
      relations: { project: true },
    });
    const newState = await this.taskStateRepository.findOne({
      where: { id: place },
      relations: { project: true },
    });

    if (!currentState || !newState) {
      throw new HttpException(
        "Состояние с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const currentTask = await this.taskRepository.findOne({
      where: { id: target },
      relations: { state: true },
    });

    if (!currentTask) {
      throw new HttpException(
        "Задача с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      currentState.project.id === currentProject.id &&
      newState.project.id === currentProject.id &&
      currentTask.state.id === currentState.id
    ) {
      currentTask.state = newState;
      await this.taskRepository.save(currentTask);
      await this.changeOrder(state, place, target);
      return currentTask;
    } else {
      throw new HttpException(
        "Проект или состояние с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async changeOrder(state, place, target) {
    const currentState = await this.taskStateRepository.findOne({
      where: { id: state },
    });
    const newState = await this.taskStateRepository.findOne({
      where: { id: place },
    });

    let oldPlace = currentState.tasksOrder.indexOf(target.toString());
    currentState.tasksOrder.splice(oldPlace, 1);
    if (!newState.tasksOrder) {
      newState.tasksOrder = [target];
    } else {
      newState.tasksOrder.push(target);
    }

    await this.taskStateRepository.save(currentState);
    await this.taskStateRepository.save(newState);
  }

  async replaceOrderState(params, head) {
    const token = head.split(" ")[1];
    const user = this.jwtService.verify(token);
    const { project, state, place } = params;

    const currentProject = await this.projectRepository.findOne({
      where: { id: project, creatorId: user.id },
    });

    if (!currentProject) {
      throw new HttpException(
        "Проект с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const currentPlace = currentProject.statesOrder.indexOf(state.toString());

    if (currentPlace === -1) {
      throw new HttpException(
        "Состояние с таким id не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    if (currentProject.statesOrder.length < place) {
      currentProject.statesOrder.splice(currentPlace, 1);
      currentProject.statesOrder.push(state);
    } else {
      currentProject.statesOrder.splice(currentPlace, 1);
      currentProject.statesOrder.splice(place, 0, state);
    }
    await this.projectRepository.save(currentProject);
    return currentProject;
  }
}
