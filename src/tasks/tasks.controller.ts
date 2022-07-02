import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/decorators/get-user'
import { User } from 'src/auth/user.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'
import { TasksService } from './tasks.service'
import { Logger } from '@nestjs/common'
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController')

    constructor(private readonly tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(
            `User ${
                user.username
            } retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
        )
        return this.tasksService.getTaskWithFilters(filterDto, user)
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User ${user.username} retrieving task ${id}`)
        return this.tasksService.getTaskById(id, user)
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} creating a new task`)
        return this.tasksService.createTask(createTaskDto, user)
    }

    @Delete('/:id')
    removeTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        this.logger.verbose(`User ${user.username} deleting task ${id}`)
        return this.tasksService.removeTask(id, user)
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id') id: string,
        @Body() { status }: UpdateTaskStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} updating task ${id}`)
        return this.tasksService.updateTask(id, status, user)
    }
}
