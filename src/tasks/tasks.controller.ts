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
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'
import { TasksService } from './tasks.service'
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTaskWithFilters(filterDto)
        } else {
            return this.tasksService.getAllTasks()
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task> {
        return this.tasksService.getTaskById(id)
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto)
    }

    @Delete('/:id')
    removeTask(@Param('id') id: string): Promise<void> {
        return this.tasksService.removeTask(id)
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id') id: string,
        @Body() { status }: UpdateTaskStatusDto,
    ): Promise<Task> {
        return this.tasksService.updateTask(id, status)
    }
}
