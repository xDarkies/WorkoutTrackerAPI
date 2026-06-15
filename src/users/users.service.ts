import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    findByEmail(email: string){
        return this.prisma.user.findUnique({
            where: { email: email}
        })
    }

    create(user: {username: string, email: string, password: string}){
        const newUser = this.prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password
            }
        })
        return newUser;
    }
}
