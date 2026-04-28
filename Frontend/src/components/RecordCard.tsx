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
    <Card className="w-full max-w-md shadow-lg">
      <Card.Header>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold">{record.user_title}</span>
          <span className="text-xs text-gray-400">{new Date(record.nasa_date).toLocaleDateString()}</span>
        </div>
      </Card.Header>
      <Card.Content>
        {record.nasa_media_type === 'image' ? (
          <img src={record.nasa_url} alt={record.nasa_title} className="rounded mb-2 max-h-60 w-full object-cover" />
        ) : (
          <iframe
            src={record.nasa_url}
            title={record.nasa_title}
            className="rounded mb-2 w-full h-60"
            allowFullScreen
          />
        )}
        <div className="mb-2">
          <span className="font-semibold">{record.nasa_title}</span>
          <p className="text-xs text-gray-500">{record.nasa_explanation}</p>
        </div>
        <div className="mb-2">
          <span className="block font-medium">Nota personal:</span>
          <p className="text-sm">{record.personal_note}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {record.tags.map((tag, idx) => (
            <Badge key={idx} color="indigo" variant="subtle">{tag}</Badge>
          ))}
        </div>
      </Card.Content>
      <Card.Footer className="flex gap-2 justify-end">
        {onEdit && <Button variant="outline" color="primary" onClick={onEdit}>Editar</Button>}
        {onDelete && <Button variant="solid" color="danger" onClick={onDelete}>Eliminar</Button>}
      </Card.Footer>
    </Card>
  );
}
