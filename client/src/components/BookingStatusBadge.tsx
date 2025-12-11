import type { BookingStatus } from '../types';

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const label = status.toUpperCase();
  return <span className={`status-pill ${status}`}>{label}</span>;
}

