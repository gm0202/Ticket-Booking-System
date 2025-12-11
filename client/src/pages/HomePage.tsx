import { useShows } from '../hooks/useShows';
import { ShowCard } from '../components/ShowCard';

export function HomePage() {
  const { data, isLoading, isError, error } = useShows();

  return (
    <div className="page">
      <section className="hero">
        <h1>Browse available shows</h1>
        <p>Pick a trip or doctor slot and book seats without overbooking worries.</p>
      </section>

      <div style={{ marginTop: 20 }} className="grid" aria-live="polite">
        {isLoading && <div className="card">Loading shows…</div>}
        {isError && <div className="status-pill failed">Failed: {error instanceof Error ? error.message : 'Unknown error'}</div>}
        {!isLoading && data?.length === 0 && <div className="card">No shows yet. Ask admin to create one.</div>}
        {data?.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}

