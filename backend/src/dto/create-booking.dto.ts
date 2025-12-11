import { IsString, IsEmail, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
    @IsInt()
    @Min(1)
    showId!: number;

    @IsString()
    @IsNotEmpty()
    customerName!: string;

    @IsEmail()
    @IsNotEmpty()
    customerEmail!: string;

    @IsInt()
    @Min(1)
    numSeats!: number;
}
