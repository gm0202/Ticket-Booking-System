import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Show } from './show.entity';
import { Booking } from './booking.entity';

@Entity('seats')
@Index('IDX_seat_show', ['showId'])
@Index('IDX_seat_booking', ['bookingId'])
@Index('IDX_seat_number', ['seatNumber', 'showId'], { unique: true })
export class Seat {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Show, show => show.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'show_id' })
  show!: Show;

  @Column({ name: 'show_id' })
  showId!: number;

  @ManyToOne(() => Booking, booking => booking.seats, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking | null = null;

  @Column({ name: 'booking_id', nullable: true })
  bookingId: number | null = null;

  @Column({ name: 'seat_number' })
  seatNumber!: number;

  @Column({ name: 'is_booked', default: false })
  isBooked: boolean = false;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
