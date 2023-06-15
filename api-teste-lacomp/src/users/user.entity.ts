import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Posts } from "src/posts/posts.entity";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: 'varchar', length: 200})
    email: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    name: string;

    @Column({nullable: false, type: 'varchar', length: 20})
    role: string;

    @Column({nullable: false})
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Posts, posts => posts.user)
    posts: Posts[]
}