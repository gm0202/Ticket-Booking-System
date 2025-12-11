import { IsString, IsDateString, IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateShowDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsDateString()
    @IsNotEmpty()
    startTime!: string;

    @IsDateString()
    @IsNotEmpty()
    endTime!: string;

    @IsInt()
    @Min(1)
    totalSeats!: number;

    @IsInt()
    @Min(0)
    price!: number;
}
