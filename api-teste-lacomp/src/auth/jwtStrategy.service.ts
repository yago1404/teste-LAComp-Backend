import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from "./auth.service";
import { User } from "src/users/user.entity";
import { JwtPayload } from 'jsonwebtoken';

// Implementação do Jwt
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: '367ac6c98160016d81ad7eca8aa7180310b911e34b055e8cf7d987e6cb2e4196',
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { email } = payload;

        return this.authService.validateUser(email);
    }
}