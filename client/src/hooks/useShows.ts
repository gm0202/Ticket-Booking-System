import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Show } from '../types';

export function useShows() {
  return useQuery<Show[]>({
    queryKey: ['shows'],
    queryFn: api.getShows,
    staleTime: 60_000,
  });
}

export function useShow(id?: string) {
  return useQuery<Show>({
    queryKey: ['show', id],
    queryFn: () => api.getShow(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

