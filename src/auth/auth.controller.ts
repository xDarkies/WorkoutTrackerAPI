import { Controller, Post, ValidationPipe, UsePipes, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/Signup.dto';

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
    login(){

    }
}
