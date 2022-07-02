import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { User } from './user.entity'
import * as CryptoJS from 'crypto-js'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async createUser({
        username,
        password,
    }: AuthCredentialsDto): Promise<void> {
        const hashPassword = CryptoJS.AES.encrypt(
            password,
            'secret key 123',
        ).toString()

        const user = this.userRepository.create({
            username,
            password: hashPassword,
        })
        try {
            await this.userRepository.save(user)
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async login({
        username,
        password,
    }: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const user = await this.userRepository.findOne({ username })
        const ValidatePassword =
            (await CryptoJS.AES.decrypt(
                user.password,
                'secret key 123',
            ).toString(CryptoJS.enc.Utf8)) === password

        if (!user || !ValidatePassword)
            throw new UnauthorizedException('Invalid credentials')
        const payload: JwtPayload = { username }
        const accessToken: string = await this.jwtService.sign(payload)
        return { accessToken }
    }
}
