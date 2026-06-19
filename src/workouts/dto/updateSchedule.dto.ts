import { IsDate, IsNotEmpty } from "class-validator"
 
export class UpdateScheduleDto{

    @IsNotEmpty()
    @IsDate()
    date: Date;
}