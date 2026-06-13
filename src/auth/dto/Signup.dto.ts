import {IsEmail, Length, IsNotEmpty, IsStrongPassword} from "class-validator"

export class SignupDto {
    @Length(3,40, {})
    username: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

}