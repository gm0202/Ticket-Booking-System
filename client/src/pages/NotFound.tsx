import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page">
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <h2>Page not found</h2>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link to="/" className="btn" style={{ marginTop: 12 }}>
          Go home
        </Link>
      </div>
    </div>
  );
}

