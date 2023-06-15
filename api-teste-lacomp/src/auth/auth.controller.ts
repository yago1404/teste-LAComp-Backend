import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "src/users/user.entity";

// Controlador do login
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(
        @Body() user: User
    ) {
        return this.authService.login(user);
    }
}
