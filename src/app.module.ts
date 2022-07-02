import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksModule } from './tasks/tasks.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.stage.${process.env.STAGE}`],
        }),
        TasksModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'task-management',
            autoLoadEntities: true,
            synchronize: true,
        }),
        //   TypeOrmModule.forRootAsync({
        //     imports: [ConfigModule],
        //     inject: [ConfigService],
        //     useFactory: async ( configService: ConfigService) => {
        //         return {
        //             type: 'postgres',
        //             autoLoadEntities: true,
        //             synchronize: true,
        //             host: configService.get('DB_HOST'),
        //             port: configService.get('DB_PORT'),
        //             username: configService.get('DB_USER'),
        //             password: configService.get('DB_PASSWORD'),
        //             database: configService.get('DATABASE'),
        //         }
        //     },
        // }),
    ],
})
export class AppModule {}
