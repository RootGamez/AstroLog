import { useEffect, useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { AstrologRecordCreate, AstrologRecordUpdate, AstrologRecord } from '../types/astrologRecord.ts';

interface RecordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AstrologRecordCreate | AstrologRecordUpdate) => void;
  initialData?: Partial<AstrologRecord>;
  isEdit?: boolean;
  loading?: boolean;
}

export function RecordModal({ open, onClose, onSubmit, initialData = {}, isEdit = false, loading = false }: RecordModalProps) {
  const [userTitle, setUserTitle] = useState(initialData.user_title || '');
  const [personalNote, setPersonalNote] = useState(initialData.personal_note || '');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [nasaDate, setNasaDate] = useState(initialData.nasa_date || '');

  useEffect(() => {
    if (!open) return;

    setUserTitle(initialData.user_title || '');
    setPersonalNote(initialData.personal_note || '');
    setTags(initialData.tags || []);
    setNasaDate(initialData.nasa_date || '');
    setTagInput('');
  }, [open, initialData]);

  const handleAddTag = () => {
    const normalizedTag = tagInput.trim();
    if (!normalizedTag || tags.includes(normalizedTag)) return;

    setTags((prev) => [...prev, normalizedTag]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((currentTag) => currentTag !== tag));
  };

  const handleSubmit = () => {
    if (isEdit) {
      if (!personalNote.trim()) return;
      onSubmit({ personal_note: personalNote.trim(), tags });
      return;
    }

    if (!userTitle.trim() || !personalNote.trim() || !nasaDate) return;

    onSubmit({
      user_title: userTitle.trim(),
      personal_note: personalNote.trim(),
      tags,
      nasa_date: nasaDate,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar registro' : 'Nuevo registro estelar'}>
      <div className="relative overflow-hidden rounded-2xl border border-indigo-700/50 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 shadow-2xl">
        <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-indigo-500/25 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5">
          {!isEdit ? (
            <Input
              label="Titulo"
              value={userTitle}
              onChange={(event) => setUserTitle(event.target.value)}
              placeholder="Ej: Noche de observacion en el cerro"
              required
            />
          ) : null}

          <TextArea
            label="Nota personal"
            value={personalNote}
            onChange={(event) => setPersonalNote(event.target.value)}
            placeholder="Escribe lo que este evento significa para ti"
            required
            rows={5}
          />

          {!isEdit ? (
            <Input
              label="Fecha APOD"
              type="date"
              value={nasaDate}
              onChange={(event) => setNasaDate(event.target.value)}
              required
            />
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-medium text-indigo-100">Tags</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return;
                  event.preventDefault();
                  handleAddTag();
                }}
                placeholder="Ej: cumpleanos, viaje, telescopio"
                containerClassName="flex-1"
              />
              <Button size="sm" onClick={handleAddTag}>
                Agregar tag
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge key={tag} color="indigo" variant="subtle" onClick={() => handleRemoveTag(tag)}>
                    {tag} <span className="ml-1">x</span>
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-slate-400">No has agregado tags todavia.</p>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="solid" color="primary" onClick={handleSubmit} loading={loading}>
              {isEdit ? 'Guardar cambios' : 'Crear registro'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
