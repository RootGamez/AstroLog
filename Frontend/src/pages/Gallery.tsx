import { useState } from 'react';
import { RecordCard } from '../components/RecordCard';
import { RecordModal } from '../components/RecordModal';
import { useAstrologRecords, useCreateRecord, useUpdateRecord, useDeleteRecord } from '../hooks/useAstrologRecords';
import type { AstrologRecord, AstrologRecordCreate, AstrologRecordUpdate } from '../types/astrologRecord.ts';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export default function Gallery() {
  const { data: records, isLoading, isError } = useAstrologRecords();
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const deleteMutation = useDeleteRecord();

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AstrologRecord | null>(null);

  const handleCreate = (data: AstrologRecordCreate) => {
    createMutation.mutate(data, {
      onSuccess: () => setModalOpen(false),
    });
  };

  const handleEdit = (record: AstrologRecord) => {
    setEditRecord(record);
    setModalOpen(true);
  };

  const handleUpdate = (data: AstrologRecordUpdate) => {
    if (editRecord) {
      updateMutation.mutate({ id: editRecord.id, data }, {
        onSuccess: () => {
          setEditRecord(null);
          setModalOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Eliminar este registro?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalSubmit = (data: AstrologRecordCreate | AstrologRecordUpdate) => {
    if (editRecord) {
      handleUpdate(data as AstrologRecordUpdate);
      return;
    }

    handleCreate(data as AstrologRecordCreate);
  };

  return (
    <div className="container mx-auto py-8 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Astrolog: Tu Bitácora Estelar</h1>
        <Button color="primary" onClick={() => { setEditRecord(null); setModalOpen(true); }}>
          Nuevo Registro
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : isError ? (
        <div className="text-red-500">Error al cargar los registros.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {records && records.length > 0 ? records.map(record => (
            <RecordCard
              key={record.id}
              record={record}
              onEdit={() => handleEdit(record)}
              onDelete={() => handleDelete(record.id)}
            />
          )) : <div className="col-span-full text-center text-gray-400">No hay registros aún.</div>}
        </div>
      )}
      <RecordModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditRecord(null); }}
        onSubmit={handleModalSubmit}
        initialData={editRecord || {}}
        isEdit={!!editRecord}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
