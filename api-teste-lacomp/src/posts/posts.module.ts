import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { User } from 'src/users/user.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Posts, User])],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [TypeOrmModule],
})
export class PostsModule {}
