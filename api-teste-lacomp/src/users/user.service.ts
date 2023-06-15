import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

    async getAll(): Promise<Partial<User>[]> {
        const usersList: User[] = await this.userRepository.find()

        if (usersList.length === 0) {
            throw new HttpException('Não foram encontrados usuários!', HttpStatus.NOT_FOUND);
        }

        const cleanUserList = usersList.map(user => {
            const newUser: Partial<User> = {...user};
            delete newUser.password;
            delete newUser.email;
            return newUser;
        })

        return cleanUserList;
    }

    async getById(id: number): Promise<Partial<User>> {
        const user: User = await this.userRepository.findOneBy({id: id})

        if (user === null) {
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
        }

        delete user.password;
        delete user.email;

        return user;
    }

    async createUser(newUser: Partial<User>): Promise<Partial<User>> {
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        newUser.password = hashedPassword;

        const createdUser: User = await this.userRepository.create(newUser);

        const savedUser = await this.userRepository.save(createdUser);

        delete savedUser.password;
        delete savedUser.email;

        return savedUser;
    }

    async updateUser(id: number, user: Partial<User>): Promise<UpdateResult> {
        const updated = await this.userRepository.update({id: id}, user);

        if (updated.affected === 0) {
            throw new HttpException('Nenhum usuário encontrado para atualizar', HttpStatus.NOT_FOUND);
        }

        return updated;
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        const deleted =  await this.userRepository.delete({id:id});

        if (deleted.affected === 0) {
            throw new HttpException('Nenhum usuário encontrado para ser removido', HttpStatus.NOT_FOUND);
        }

        return deleted;
    }
} 