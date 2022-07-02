import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { AuthModule } from '../auth/auth.module'
import { PassportModule } from '@nestjs/passport'

@Module({
    imports: [TypeOrmModule.forFeature([Task]), AuthModule],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
