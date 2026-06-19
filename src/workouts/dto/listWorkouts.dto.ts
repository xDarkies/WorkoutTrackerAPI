import { IsDate, IsNotEmpty } from "class-validator";

export class ListWorkoutsDto{
    @IsNotEmpty()
    @IsDate()
    startDate: Date;
    
    @IsNotEmpty()
    @IsDate()
    endDate: Date;
}