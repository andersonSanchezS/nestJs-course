import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { Logger } from '@nestjs/common'
@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController')
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async singUp(
        @Body() authCredentialsDto: AuthCredentialsDto,
    ): Promise<void> {
        this.logger.verbose(`User ${authCredentialsDto.username} sing up`)
        return this.authService.createUser(authCredentialsDto)
    }

    @Post('login')
    async login(
        @Body() authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
        this.logger.verbose(`User ${authCredentialsDto.username} login`)
        return this.authService.login(authCredentialsDto)
    }
}
