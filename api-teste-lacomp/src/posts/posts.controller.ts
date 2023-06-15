import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Posts } from "./posts.entity";
import { RolesAuthGuard } from "src/auth/auth.service";
import { AuthGuard } from '@nestjs/passport';

@Controller('Posts')
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    @Get()
    async getAll() {
        try{
            return await this.postService.getAll()
        } catch(err) {
            throw new HttpException({
                statusCode: err.getStatus(),
                err: err.message,
            }, err.getStatus(), {
                cause: err,
            });
        }
    }

    @Get(':id')
    async getById(
        @Param('id') id: number
    ) {
        try{
            return await this.postService.getAll()
        } catch(err) {
            throw new HttpException({
                statusCode: err.getStatus(),
                err: err.message,
            }, err.getStatus(), {
                cause: err,
            });
        }
    }

    @UseGuards(AuthGuard('jwt'), new RolesAuthGuard('autor'))
    @Post()
    async createPost(@Body() post: Posts) {
        try {
            const camposObrigatorios = ['title', 'subtitle', 'content', 'author'];
            const camposEmFalta = [];

            camposObrigatorios.forEach((campo) => {
                if (!post[campo]) {
                    camposEmFalta.push(campo);
                }
            });

            if (camposEmFalta.length > 0) {
                throw new HttpException(`Os campos ${camposEmFalta} são obrigatórios!`, HttpStatus.BAD_REQUEST);
            }

            return await this.postService.createPost(post);
        } catch(err) {
            throw new HttpException({
                statusCode: err.getStatus(),
                err: err.message,
            }, err.getStatus(), {
                cause: err,
            });
        }
    }

    @UseGuards(AuthGuard('jwt'), new RolesAuthGuard('autor'))
    @Put(':id')
    async updatePost(
        @Param('id') id: number,
        @Body() post: Posts
    ) {
        try {
            return await this.postService.updatePost(id, post);
        } catch(err) {
            throw new HttpException({
                statusCode: err.getStatus(),
                err: err.message,
            }, err.getStatus(), {
                cause: err,
            });
        }
    }

    @UseGuards(AuthGuard('jwt'), new RolesAuthGuard('autor'))
    @Delete(':id')
    async deletePost(
        @Param('id') id: number
    ) {
        try {
            return await this.postService.deletePost(id);
        } catch(err) {
            throw new HttpException({
                statusCode: err.getStatus(),
                err: err.message,
            }, err.getStatus(), {
                cause: err,
            })
        }
    }
}