import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRecords, createRecord, updateRecord, deleteRecord } from '../api/astrolog';
import type { AstrologRecord, AstrologRecordUpdate } from '../types/astrologRecord.ts';

export function useAstrologRecords() {
  return useQuery<AstrologRecord[]>({
    queryKey: ['astrolog-records'],
    queryFn: fetchRecords,
  });
}

export function useCreateRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['astrolog-records'] }),
  });
}

export function useUpdateRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AstrologRecordUpdate }) => updateRecord(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['astrolog-records'] }),
  });
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['astrolog-records'] }),
  });
}
