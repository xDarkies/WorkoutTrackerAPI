import { Controller, Post, ValidationPipe, UsePipes, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/Signup.dto';
import { LoginDto } from './dto/Login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    @UsePipes(ValidationPipe)
    signup(@Body() signupDto: SignupDto){
        return this.authService.signup(signupDto)
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    auth(@Request() req){
        return req.user;
    }
}
