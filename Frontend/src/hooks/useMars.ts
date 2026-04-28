import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchMars, createFavorite, fetchFavorites, deleteFavorite } from '../api/mars';
import type { MarsSearchResponse, MarsFavoriteCreate } from '../types/mars';

export function useMarsSearch(params: { date?: string; rover?: string } | null) {
  return useQuery({
    queryKey: ['mars-search', params],
    queryFn: () => searchMars(params || {}),
    enabled: !!params,
  });
}

export function useCreateFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MarsFavoriteCreate) => createFavorite(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mars-favorites'] }),
  });
}

export function useMarsFavorites() {
  return useQuery({
    queryKey: ['mars-favorites'],
    queryFn: fetchFavorites,
  });
}

export function useDeleteFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFavorite(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mars-favorites'] }),
  });
}
