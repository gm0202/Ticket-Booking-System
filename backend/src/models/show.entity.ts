import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Booking } from './booking.entity';
import { Seat } from './seat.entity';
import { BookingStatus } from './booking.entity';

@Entity('shows')
export class Show {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @Column('text', { nullable: true })
    description: string | null = null;

    @Column({ name: 'start_time', type: 'timestamp with time zone' })
    startTime!: Date;

    @Column({ name: 'end_time', type: 'timestamp with time zone' })
    endTime!: Date;

    @Column({ name: 'total_seats' })
    totalSeats!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @OneToMany(() => Booking, booking => booking.show)
    bookings!: Booking[];

    @OneToMany(() => Seat, seat => seat.show)
    seats!: Seat[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    get availableSeats(): number {
        return this.totalSeats - (this.bookings?.reduce((sum, booking) => 
            sum + (booking.status === BookingStatus.CONFIRMED ? booking.numSeats : 0), 0) || 0);
    }

    canBookSeats(seats: number): boolean {
        return this.availableSeats >= seats && this.startTime > new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    validateShowTimings(): void {
        if (this.startTime >= this.endTime) {
            throw new Error('End time must be after start time');
        }
    }

    // Method to check if a seat is available
    isSeatAvailable(seatNumber: number): boolean {
        return !this.seats.some(seat => seat.seatNumber === seatNumber && seat.isBooked);
    }

    // Method to get available seats
    getAvailableSeats(): Seat[] {
        return this.seats.filter(seat => !seat.isBooked);
    }
}
