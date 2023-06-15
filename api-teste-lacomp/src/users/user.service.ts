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
            return newUser;
        })

        return cleanUserList;
    }

    async getById(id: number): Promise<Partial<User>> {
        const user: User = await this.userRepository.findOneBy({id: id})

        if (!user) {
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
        }

        delete user.password;

        return user;
    }

    async findByEmail(email: string): Promise<User> | null {
        const user: User = await this.userRepository.findOneBy({email: email});

        if (user) {
            return user;
        }

        return null;
    }

    async createUser(newUser: Partial<User>): Promise<Partial<User>> {
        if (newUser.role === 'admin') {
            throw new HttpException('Você não tem permissão para criar um usuário com privilégios de admin!', HttpStatus.UNAUTHORIZED);
        }
        
        const isValidEmail: Boolean = await this.validateEmail(newUser.email);

        if (!isValidEmail) {
            throw new HttpException('Email já cadastrado!', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        newUser.password = hashedPassword;

        const createdUser: User = await this.userRepository.create(newUser);

        const savedUser = await this.userRepository.save(createdUser);
        
        delete savedUser.password;

        return savedUser;
    }

    async createAdminUser(newUser: User): Promise<User> {
        const isValidEmail: Boolean = await this.validateEmail(newUser.email);

        if (!isValidEmail) {
            throw new HttpException('Email já cadastrado!', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        newUser.password = hashedPassword;

        const createdUser: User = await this.userRepository.create(newUser);

        const savedUser = await this.userRepository.save(createdUser);
        
        delete savedUser.password;

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

    async validatePassword(email: string, password: string): Promise<Boolean> {
        const userFound: User = await this.findByEmail(email);
        
        const isEqualPassword = await bcrypt.compare(password, userFound.password);

        if (userFound && isEqualPassword) {
            return true;
        }

        return false;
    }

    async validateEmail(email: string): Promise<Boolean> {
        const foundMail = await this.findByEmail(email);

        if (foundMail) {
            return false;
        }

        return true;
    }
} 
