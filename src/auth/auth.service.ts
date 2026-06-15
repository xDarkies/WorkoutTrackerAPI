import "dotenv/config"
import {  ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/Signup.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async signup(singupDto: SignupDto){
        const {username, email, password} = singupDto;
        const usersExists = await this.usersService.findByEmail(email)
        if(usersExists){
            throw new ConflictException("Email already registered")
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS!))

        const newUser = {
            username,
            email,
            password: hashedPassword
        }
        const created = await this.usersService.create(newUser);

        const payload = { sub: created.id, email: created.email}
        return {
            message: "User successfully registered",
            access_token: await this.jwtService.signAsync(payload)
        }
    }
    
    async login(loginDto: LoginDto){
        const {email, password} = loginDto;

        const user = await this.usersService.findByEmail(email)
        if(!user)
            throw new UnauthorizedException("Invalid credentials")
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
            throw new UnauthorizedException("Invalid credentials")

        const payload = {sub: user.id, email: user.email}

        return{
            message: "Login succesfull",
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
