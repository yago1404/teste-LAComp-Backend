import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";
import { DeleteResult, UpdateResult, Repository } from "typeorm";
import { User } from "src/users/user.entity";


@Injectable()
export class PostsService {
    constructor(@InjectRepository(Posts)
                private readonly postRepository: Repository<Posts>,
                @InjectRepository(User)
                private readonly userRepository: Repository<User>) {}

    async getAll(): Promise<Posts[]> {
        const postsList: Posts[] = await this.postRepository.find();

        if (postsList.length === 0) {
            throw new HttpException('Não foram encontrados posts!', HttpStatus.NOT_FOUND);
        }

        return postsList;
    }

    async getById(id: number): Promise<Posts> {
        const post: Posts = await this.postRepository.findOneBy({id: id});

        if (!post) {
            throw new HttpException('Não foi encontrado post para esse ID!', HttpStatus.NOT_FOUND);
        }

        return post;
    }

    async createPost(post: Partial<Posts>): Promise<Posts> {
        const postAuthor = await this.userRepository.findOneBy({name: post.author});

        if (!postAuthor) {
            throw new HttpException('Autor não existente!', HttpStatus.NOT_FOUND);
        }

        post.user = postAuthor;

        const createdPost: Posts = await this.postRepository.create(post);
        const posted = await this.postRepository.save(createdPost);

        delete posted.user.password;
        delete posted.user.createdAt;
        delete posted.user.updatedAt;

        return posted;
    }

    async updatePost(id: number, post: Posts): Promise<UpdateResult>  {
        const updated = await this.postRepository.update({id: id}, post);

        if (updated.affected === 0) {
            throw new HttpException('Nenhum post encontrado para ser atualizado!', HttpStatus.NOT_FOUND);
        }

        return updated;
    }

    async deletePost(id: number): Promise<DeleteResult> {
        const deleted = await this.postRepository.delete({id: id});

        if (deleted.affected === 0) {
            throw new HttpException('Nenhum post encontrado para deletar!', HttpStatus.NOT_FOUND);
        }

        return deleted;
    }
}