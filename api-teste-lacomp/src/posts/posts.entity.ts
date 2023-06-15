import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Posts extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: 'varchar', length: 200})
    title: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    subtitle: string;

    @Column({nullable: false, type: 'varchar', length: 20000})
    content: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    author: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.posts)
    user: User;
}