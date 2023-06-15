import { ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.entity";
import { AuthGuard } from '@nestjs/passport';

// Classe validadora do login
@Injectable()
export class AuthService {
    // Necessaria injeção de dependencia do userService e jwtService para autenticação e validação
    constructor(private readonly userService: UsersService,
                private readonly jwtService: JwtService) {}

    async validateUser(email: string): Promise<User> {
        const user: User = await this.userService.findByEmail(email);

        if (!user) {
            throw new HttpException('Não autorizado!', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    // Processa o login e gera o token de acesso a API
    async login(user: Partial<User>) {
        const isValidUser = await this.userService.validatePassword(user.email, user.password);

        if (isValidUser) {
            const userLog: User = await this.userService.findByEmail(user.email);
            const payload = {email: userLog.email, sub: userLog.id};
            const expiresIn: number = 21600;
            const expiresAt: Date = new Date();

            expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

            return {
                user: userLog.name,
                role: userLog.role,
                access_token: this.jwtService.sign(payload, {
                    secret:'367ac6c98160016d81ad7eca8aa7180310b911e34b055e8cf7d987e6cb2e4196',
                    expiresIn: expiresIn + ' seconds',
                }),
                expiresAt: expiresAt.toISOString(),
            };
        }

        throw new HttpException('Login não realizado, senha ou email incorretos!', HttpStatus.UNAUTHORIZED);
    }
}

// Classe responsavel por verificar as permissões do usuário logado
@Injectable()
export class RolesAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly role: string) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const user = context.switchToHttp().getRequest().user;

        return user && user.role === this.role;
    }
}
