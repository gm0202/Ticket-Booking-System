interface SeatGridProps {
  total: number;
  booked: Set<number>;
  selected: number[];
  onToggle: (seat: number) => void;
}

export function SeatGrid({ total, booked, selected, onToggle }: SeatGridProps) {
  const seats = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="seat-grid">
      {seats.map((seat) => {
        const isBooked = booked.has(seat);
        const isSelected = selected.includes(seat);
        return (
          <button
            key={seat}
            className={`seat${isBooked ? ' booked' : ''}${isSelected ? ' selected' : ''}`}
            onClick={() => !isBooked && onToggle(seat)}
            disabled={isBooked}
            aria-pressed={isSelected}
            aria-label={`Seat ${seat}${isBooked ? ' booked' : ''}`}
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
}

