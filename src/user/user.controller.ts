import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int-pipe.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserReponseDto } from './dto/user-reponse.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async findOne(@Req() req: AuthenticatedRequest) {
        const user = await this.userService.findOneByOrFail({ id: req.user.id})
        return new UserReponseDto(user)
    }

    @Post()
    async create(@Body() dto: CreateUserDto) {
        const user = await this.userService.create(dto)
        return new UserReponseDto(user)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async update(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdateUserDto
    ) {
        const user = await this.userService.update(req.user.id, dto)
        return new UserReponseDto(user)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me/password')
    async updatePassword(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdatePasswordDto
    ) {
        const user = await this.userService.updatePassword(req.user.id, dto)
        return new UserReponseDto(user)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('me')
    async remove(@Req() req: AuthenticatedRequest) {
        const user = await this.userService.remove(req.user.id)
        return new UserReponseDto(user)
    }
}
