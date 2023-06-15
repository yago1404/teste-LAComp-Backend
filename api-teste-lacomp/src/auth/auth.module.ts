import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthController } from './auth.controller';
import { AuthService, RolesAuthGuard } from './auth.service';
import { JwtStrategy } from './jwtStrategy.service';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            // Secret para geração do Bearer token 
            secret:'367ac6c98160016d81ad7eca8aa7180310b911e34b055e8cf7d987e6cb2e4196',
            signOptions: {expiresIn: '6h'},
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtService, RolesAuthGuard],
    exports: [AuthService],
})
export class AuthModule {}
