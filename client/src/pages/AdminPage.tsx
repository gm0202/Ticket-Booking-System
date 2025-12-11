import { useAuth } from '../context/AuthContext';
import { useShows } from '../hooks/useShows';
import { formatDate, formatTime } from '../utils/format';
import { ShowForm } from '../components/ShowForm';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useShows();

  const blocked = user.role !== 'admin';

  return (
    <div className="page">
      <section className="hero" style={{ marginBottom: 16 }}>
        <h1>Admin dashboard</h1>
        <p>Create and manage shows/trips. Basic mock auth only.</p>
      </section>

      {blocked && (
        <div className="callout" style={{ marginBottom: 16 }}>
          Switch to the admin role from the top bar to add shows.
        </div>
      )}

      {!blocked && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>Create show</h2>
            <Link to="/admin/approvals" className="btn secondary">
              Pending bookings
            </Link>
          </div>
          <ShowForm />
        </>
      )}

      <div className="card">
        <div className="section-title">
          <h2>Existing shows</h2>
          {isLoading && <span className="badge">Loading…</span>}
        </div>
        {error && (
          <div className="status-pill failed">
            {(error as Error).message || 'Could not load shows'}
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Starts</th>
              <th>Seats</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((show) => (
              <tr key={show.id}>
                <td>{show.name}</td>
                <td>
                  {formatDate(show.startTime)} · {formatTime(show.startTime)}
                </td>
                <td>{show.totalSeats}</td>
                <td>{show.price ? `₹ ${Number(show.price).toFixed(2)}` : 'NA'}</td>
              </tr>
            ))}
            {!isLoading && !data?.length && (
              <tr>
                <td colSpan={4} className="muted">
                  No shows created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

