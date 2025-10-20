import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
        @InjectRepository(User)
		private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingService,
	) {}

    async findOneByOrFail(userData: Partial<User>) {
        const user = await this.userRepository.findOneBy(userData)

        if (!user) {
            throw new NotFoundException('Usuário não encontrado')
        }
        return user
    }

    async failIfEmailExists(email: string) {
        const exists = await this.userRepository.existsBy({
            email
        })

        if (exists) {
            throw new ConflictException('E-mail já existe')
        }
    }

    async create(dto: CreateUserDto) {
        await this.failIfEmailExists(dto.email)

        const hashPassword = await this.hashingService.hash(dto.password)
        const newUser: CreateUserDto = {
            name: dto.name,
            email: dto.email,
            password: hashPassword,
        }

        const created = this.userRepository.save(newUser)
        return created
    }

    findByEmail(email: string) {
        return this.userRepository.findOneBy({ email })
    }

    findById(id: string) {
        return this.userRepository.findOneBy({ id })
    }

    async update(id: string, dto: UpdateUserDto) {
        if (!dto.name && !dto.email) {
            throw new BadRequestException('Dados não enviados')
        }

        const user = await this.findOneByOrFail({ id })

        user.name = dto.name ?? user.name

        if (dto.email && dto.email !== user.email){
            await this.failIfEmailExists(dto.email)
            user.email = dto.email
            user.forceLogout = true
        }

        return this.save(user)
    }

    save(user: User) {
        return this.userRepository.save(user)
    }
}
