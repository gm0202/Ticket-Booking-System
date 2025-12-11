import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api/client';
import type { CreateShowInput } from '../types';

const initialForm: CreateShowInput = {
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  totalSeats: 40,
  price: 300,
};

export function ShowForm() {
  const [form, setForm] = useState<CreateShowInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.createShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      setForm(initialForm);
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startTime || !form.endTime) {
      setError('Name, start time and end time are required');
      return;
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError('End time must be after start time');
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="section-title">
        <h2>Create Show/Trip</h2>
        {mutation.isPending && <span className="badge">Saving…</span>}
      </div>
      <form className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }} onSubmit={handleSubmit}>
        <label className="grid" style={{ gap: 6 }}>
          <span className="label">Name</span>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Route or doctor name"
            required
          />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span className="label">Description</span>
          <input
            className="input"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Optional context"
          />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span className="label">Start time</span>
          <input
            type="datetime-local"
            className="input"
            value={form.startTime}
            onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            required
          />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span className="label">End time</span>
          <input
            type="datetime-local"
            className="input"
            value={form.endTime}
            onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
            required
          />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span className="label">Total seats</span>
          <input
            type="number"
            min={1}
            className="input"
            value={form.totalSeats}
            onChange={(e) => setForm((f) => ({ ...f, totalSeats: Number(e.target.value) }))}
            required
          />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span className="label">Price</span>
          <input
            type="number"
            min={0}
            className="input"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            required
          />
        </label>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn" type="submit" disabled={mutation.isPending}>
            Create show
          </button>
          {error && <span className="status-pill failed">{error}</span>}
          {mutation.isSuccess && !error && <span className="status-pill confirmed">Created</span>}
        </div>
      </form>
    </div>
  );
}

