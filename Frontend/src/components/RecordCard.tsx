import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { AstrologRecord } from '../types/astrologRecord.ts';

interface RecordCardProps {
  record: AstrologRecord;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RecordCard({ record, onEdit, onDelete }: RecordCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-indigo-700/50 bg-slate-950/70 shadow-[0_20px_60px_-35px_rgba(56,189,248,0.7)] transition-transform duration-300 hover:-translate-y-1">
      <Card.Header className="border-indigo-800/60">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold text-cyan-100">{record.user_title}</span>
          <span className="text-xs text-slate-400">{new Date(record.nasa_date).toLocaleDateString()}</span>
        </div>
      </Card.Header>
      <Card.Content className="space-y-3">
        {record.nasa_media_type === 'image' ? (
          <img src={record.nasa_url} alt={record.nasa_title} className="mb-2 h-56 w-full rounded-xl border border-indigo-900/60 object-cover" />
        ) : (
          <iframe
            src={record.nasa_url}
            title={record.nasa_title}
            className="mb-2 h-56 w-full rounded-xl border border-indigo-900/60"
            allowFullScreen
          />
        )}
        <div className="space-y-1">
          <span className="font-semibold text-white">{record.nasa_title}</span>
          <p className="max-h-24 overflow-auto text-xs leading-relaxed text-slate-400">{record.nasa_explanation}</p>
        </div>
        <div className="rounded-lg border border-indigo-800/40 bg-slate-900/60 p-3">
          <span className="block text-xs font-semibold uppercase tracking-wider text-cyan-200">Nota personal</span>
          <p className="mt-1 text-sm text-slate-200">{record.personal_note}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {record.tags.map((tag, idx) => (
            <Badge key={idx} color="indigo" variant="subtle">
              {tag}
            </Badge>
          ))}
        </div>
      </Card.Content>
      <Card.Footer className="flex justify-end gap-2 border-indigo-800/60">
        {onEdit && (
          <Button variant="outline" color="primary" onClick={onEdit}>
            Editar
          </Button>
        )}
        {onDelete && (
          <Button variant="solid" color="danger" onClick={onDelete}>
            Eliminar
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}
