import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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

        // TODO: Add users find options
        const usersExists = {};
        if(usersExists){
            throw new ConflictException("Email already registered")
        }

        const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS!)

        const newUser = {
            id: 1,
            username,
            email,
            password: hashedPassword
        }

        // TODO: Add to database

        const payload = { sub: newUser.id, email: newUser.username}

        return {
            message: "User successfully registered",
            access_token: await this.jwtService.signAsync(payload)
        }
    }
    
    async login(loginDto: LoginDto){
        const {email, password} = loginDto;

        // TODO: Find user
        const user = {id: 1, username: "Marc",email: "something@gmail.com", password: "pass"}
        if(!user)
            throw new UnauthorizedException("Invalid credentials")
        const isMatch = await bcrypt.compare(user.password, password);
        if(!isMatch)
            throw new UnauthorizedException("Invalid credentials")

        const payload = {sub: user.id, username: user.username}

        return{
            message: "Login succesfull",
            access_token: this.jwtService.signAsync(payload)
        }
    }
}
