import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { Posts } from 'src/posts/posts.entity';

// Users Module exportado
@Module({
    imports: [TypeOrmModule.forFeature([User, Posts])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
