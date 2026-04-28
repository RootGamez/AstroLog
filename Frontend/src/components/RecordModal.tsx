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
      <div className="flex flex-col gap-4">
        {!isEdit && (
          <Input
            label="Título"
            value={userTitle}
            onChange={e => setUserTitle(e.target.value)}
            required
          />
        )}
        <TextArea
          label="Nota Personal"
          value={personalNote}
          onChange={e => setPersonalNote(e.target.value)}
          required
        />
        {!isEdit && (
          <Input
            label="Fecha (YYYY-MM-DD)"
            type="date"
            value={nasaDate}
            onChange={e => setNasaDate(e.target.value)}
            required
          />
        )}
        <div>
          <Input
            label="Agregar Tag"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : undefined}
            trailingIcon={<Button size="xs" onClick={handleAddTag}>Agregar</Button>}
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <Badge key={tag} color="indigo" variant="subtle" onClick={() => handleRemoveTag(tag)} className="cursor-pointer">{tag} ×</Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="solid" color="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Guardar Cambios' : 'Crear Registro'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
