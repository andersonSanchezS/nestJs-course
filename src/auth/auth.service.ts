import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { User } from './user.entity'
import * as CryptoJS from 'crypto-js'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async verifyUser(userName: string) {
        return await this.userRepository.findOne({ username: userName })
    }

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
}
