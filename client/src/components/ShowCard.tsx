import { Link } from 'react-router-dom';
import type { Show } from '../types';
import { formatDate, formatTime } from '../utils/format';

interface Props {
  show: Show;
}

function availability(show: Show) {
  if (typeof show.availableSeats === 'number') return show.availableSeats;
  if (show.bookings?.length) {
    const confirmed = show.bookings.filter((b) => b.status === 'confirmed');
    const used = confirmed.reduce((sum, b) => sum + (b.numSeats || 0), 0);
    return Math.max(0, show.totalSeats - used);
  }
  return show.totalSeats;
}

export function ShowCard({ show }: Props) {
  const available = availability(show);
  const isSoon = new Date(show.startTime).getTime() - Date.now() < 3 * 60 * 60 * 1000;

  return (
    <div className="card" style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="label">Show</div>
          <h3 style={{ margin: '4px 0 0', color: '#0f172a' }}>{show.name}</h3>
        </div>
        <span className="pill">
          {formatDate(show.startTime)} · {formatTime(show.startTime)}
        </span>
      </div>
      {show.description && <p className="muted" style={{ margin: '0 0 8px' }}>{show.description}</p>}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="status-pill confirmed">Total: {show.totalSeats}</span>
        <span className={`status-pill ${available > 0 ? 'pending' : 'failed'}`}>
          {available > 0 ? `${available} seats left` : 'Sold out'}
        </span>
        {isSoon && <span className="status-pill expired">Starts soon</span>}
        {show.price !== undefined && (
          <span className="status-pill confirmed">₹ {Number(show.price).toFixed(2)}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Link to={`/booking/${show.id}`} className="btn">
          Book seats
        </Link>
      </div>
    </div>
  );
}

