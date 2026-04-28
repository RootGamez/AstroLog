import { useState, useEffect } from 'react';
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
    if (open) {
      setUserTitle(initialData.user_title || '');
      setPersonalNote(initialData.personal_note || '');
      setTags(initialData.tags || []);
      setNasaDate(initialData.nasa_date || '');
    }
  }, [open, initialData]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (!userTitle || !personalNote || !nasaDate) return;
    const data = isEdit
      ? { personal_note: personalNote, tags }
      : { user_title: userTitle, personal_note: personalNote, tags, nasa_date: nasaDate };
    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar Registro' : 'Nuevo Registro'}>
      <div className="flex flex-col gap-6 bg-gradient-to-br from-indigo-950 via-blue-900 to-black p-6 rounded-2xl border-2 border-indigo-700 shadow-[0_0_32px_4px_rgba(80,0,255,0.25)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col gap-6">
          {!isEdit && (
            <Input
              label="Título"
              value={userTitle}
              onChange={e => setUserTitle(e.target.value)}
              required
              className="bg-black/60 border-indigo-700 text-indigo-100 placeholder-indigo-400 focus:ring-indigo-400"
            />
          )}
          <TextArea
            label="Nota Personal"
            value={personalNote}
            onChange={e => setPersonalNote(e.target.value)}
            required
            className="bg-black/60 border-indigo-700 text-indigo-100 placeholder-indigo-400 focus:ring-indigo-400"
          />
          {!isEdit && (
            <Input
              label="Fecha (YYYY-MM-DD)"
              type="date"
              value={nasaDate}
              onChange={e => setNasaDate(e.target.value)}
              required
              className="bg-black/60 border-indigo-700 text-indigo-100 placeholder-indigo-400 focus:ring-indigo-400"
            />
          )}
          <div>
            <label className="block text-indigo-200 text-sm font-semibold mb-1">Agregar Tag</label>
            <div className="flex gap-2 items-center">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : undefined}
                className="bg-black/60 border-indigo-700 text-indigo-100 placeholder-indigo-400 focus:ring-indigo-400 flex-1"
              />
              <Button size="sm" onClick={handleAddTag} className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md hover:from-indigo-500 hover:to-blue-400">Agregar</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  color="indigo"
                  variant="subtle"
                  onClick={() => handleRemoveTag(tag)}
                  className="cursor-pointer bg-gradient-to-r from-indigo-700 via-blue-800 to-indigo-900 text-indigo-100 border border-indigo-500/40 shadow-[0_0_8px_2px_rgba(80,0,255,0.15)] hover:scale-105 transition-transform duration-150"
                >
                  {tag} <span className="ml-1 text-indigo-300">×</span>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={loading} className="border-indigo-700 text-indigo-200 hover:bg-indigo-900/30">Cancelar</Button>
            <Button variant="solid" color="primary" onClick={handleSubmit} loading={loading} className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg hover:from-indigo-500 hover:to-blue-400">
              {isEdit ? 'Guardar Cambios' : 'Crear Registro'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
