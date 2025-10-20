import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayLoad } from "./types/jwt-payload.type";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        const secret = process.env.JWT_SECRET

        if (!secret) {
            throw new InternalServerErrorException(
                'JWT_SECRET not found in .env'
            )
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret
        })
    }

    async validate(payload: JwtPayLoad) {
        const user = await this.userService.findById(payload.sub)

        if (!user) {
            throw new UnauthorizedException('Você precisa fazer login')
        }
        
        return user
    }
}
