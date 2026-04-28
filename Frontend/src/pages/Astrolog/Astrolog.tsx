// Ensure default export for ESM/TypeScript
import { useState } from 'react';
import { RecordCard } from '../../components/RecordCard';
import { RecordModal } from '../../components/RecordModal';
import { useAstrologRecords, useCreateRecord, useUpdateRecord, useDeleteRecord } from '../../hooks/useAstrologRecords';
import type { AstrologRecord, AstrologRecordCreate, AstrologRecordUpdate } from '../../types/astrologRecord.ts';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Starfield } from '../../components/layout/Starfield';

interface GalleryProps {
	onBack?: () => void;
}

function Astrolog({ onBack }: GalleryProps) {
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
			updateMutation.mutate(
				{ id: editRecord.id, data },
				{
					onSuccess: () => {
						setEditRecord(null);
						setModalOpen(false);
					},
				}
			);
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
		<main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,#0f2f68_0%,transparent_30%),radial-gradient(circle_at_90%_0%,#1e3a8a_0%,transparent_35%),#020617] text-slate-100">
			<Starfield density={140} />
			<section className="relative mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
				<header className="mb-8 rounded-2xl border border-indigo-700/40 bg-slate-950/65 p-6 shadow-xl backdrop-blur-md">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Modulo activo</p>
							<h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">Astrolog · Tu Bitacora Estelar</h1>
							<p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
								Administra tus entradas personales y conectalas con el APOD diario de NASA en una galeria moderna y responsive.
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							{onBack ? (
								<Button variant="outline" onClick={onBack}>
									Volver al inicio
								</Button>
							) : null}
							<Button
								color="primary"
								onClick={() => {
									setEditRecord(null);
									setModalOpen(true);
								}}
							>
								Nuevo registro
							</Button>
						</div>
					</div>
				</header>

				{isLoading ? (
					<div className="flex h-80 items-center justify-center rounded-2xl border border-indigo-800/50 bg-slate-950/55">
						<Spinner size="lg" />
					</div>
				) : isError ? (
					<div className="rounded-2xl border border-rose-500/50 bg-rose-950/35 p-6 text-rose-200">
						Error al cargar los registros. Verifica el backend e intenta nuevamente.
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
						{records && records.length > 0 ? (
							records.map((record) => (
								<RecordCard
									key={record.id}
									record={record}
									onEdit={() => handleEdit(record)}
									onDelete={() => handleDelete(record.id)}
								/>
							))
						) : (
							<div className="col-span-full rounded-2xl border border-indigo-800/40 bg-slate-950/40 p-10 text-center text-slate-300">
								No hay registros aun. Crea el primero para comenzar tu bitacora estelar.
							</div>
						)}
					</div>
				)}
			</section>

			<RecordModal
				open={modalOpen}
				onClose={() => {
					setModalOpen(false);
					setEditRecord(null);
				}}
				onSubmit={handleModalSubmit}
				initialData={editRecord || {}}
				isEdit={!!editRecord}
				loading={createMutation.isPending || updateMutation.isPending}
			/>
		</main>
	);
}

export default Astrolog;
