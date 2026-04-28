import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Input } from './Input';

export interface DatePickerProps {
  label?: string;
  value?: Date | string | null;
  onChange?: (v: Date | null) => void;
  required?: boolean;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

function toDate(v: Date | string | null | undefined): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  // expected ISO yyyy-mm-dd or dd/mm/yyyy
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T00:00:00');
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = Date.parse(s);
  return isNaN(parsed) ? null : new Date(parsed);
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function DatePicker({ label, value, onChange, required, helperText, error, containerClassName }: DatePickerProps) {
  const initialDate = toDate(value);
  const [selected, setSelected] = useState<Date | null>(initialDate);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string>(selected ? `${pad(selected.getDate())}/${pad(selected.getMonth() + 1)}/${selected.getFullYear()}` : '');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    setSelected(toDate(value));
  }, [value]);

  useEffect(() => {
    setText(selected ? `${pad(selected.getDate())}/${pad(selected.getMonth() + 1)}/${selected.getFullYear()}` : '');
    onChange?.(selected);
  }, [selected]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (inputRef.current && inputRef.current.contains(target)) return;
      if (portalRef.current && portalRef.current.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const inp = inputRef.current;
    if (!inp) return;
    const rect = inp.getBoundingClientRect();
    const desiredWidth = Math.min(Math.max(rect.width, 220), 360);
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 6;
    if (left + desiredWidth > window.innerWidth) {
      left = Math.max(8, window.innerWidth - desiredWidth - 8);
    }
    setPopupStyle({ position: 'absolute', left, top, width: desiredWidth, zIndex: 9999 });
  }, [open]);

  const monthStart = useMemo(() => {
    const d = selected ? new Date(selected) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }, [selected]);

  const days = useMemo(() => {
    const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1).getDay();
    const total = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    const arr: Array<number | null> = [];
    for (let i = 0; i < start; i++) arr.push(null);
    for (let d = 1; d <= total; d++) arr.push(d);
    return arr;
  }, [monthStart]);

  function pickDay(d: number) {
    const dt = new Date(monthStart.getFullYear(), monthStart.getMonth(), d);
    setSelected(dt);
    setOpen(false);
  }

  function formatMask(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
  }

  function onTextChange(eventOrValue: React.ChangeEvent<HTMLInputElement> | string) {
    let rawValue: string;
    let caret: number;
    if (typeof eventOrValue === 'string') {
      rawValue = eventOrValue;
      caret = rawValue.length;
    } else {
      rawValue = eventOrValue.target?.value ?? '';
      caret = eventOrValue.target?.selectionStart ?? rawValue.length;
    }

    // count digits before caret in the current raw value
    const digitsBeforeCaret = (rawValue.slice(0, caret).match(/\d/g) || []).length;

    const formatted = formatMask(rawValue);
    setText(formatted);

    // try parse when full
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
      const [dd, mm, yyyy] = formatted.split('/').map(Number);
      const dt = new Date(yyyy, mm - 1, dd);
      if (!isNaN(dt.getTime())) setSelected(dt);
    }

    // restore caret position mapped to formatted string (position after N digits)
    window.requestAnimationFrame(() => {
      const inp = inputRef.current;
      if (!inp) return;
      let digitsSeen = 0;
      let newPos = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9]/.test(formatted[i])) digitsSeen++;
        if (digitsSeen >= digitsBeforeCaret) { newPos = i + 1; break; }
      }
      try { inp.setSelectionRange(newPos, newPos); } catch (_) {}
    });
  }

  const popup = (
    <div ref={portalRef} style={popupStyle ?? undefined} className="rounded-md bg-slate-900 p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <strong>{monthStart.toLocaleString(undefined, { month: 'long' })} {monthStart.getFullYear()}</strong>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelected((s) => s ? new Date(s.getFullYear() - 1, s.getMonth(), 1) : new Date(monthStart.getFullYear() - 1, monthStart.getMonth(), 1))}
            title="Año anterior"
            className="rounded px-2 py-1 text-xs bg-slate-800"
          >«</button>
          <button
            type="button"
            onClick={() => setSelected((s) => s ? new Date(s.getFullYear(), s.getMonth() - 1, 1) : new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1))}
            title="Mes anterior"
            className="rounded px-2 py-1 text-xs bg-slate-800"
          >◀</button>
          <button
            type="button"
            onClick={() => setSelected((s) => s ? new Date(s.getFullYear(), s.getMonth() + 1, 1) : new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1))}
            title="Mes siguiente"
            className="rounded px-2 py-1 text-xs bg-slate-800"
          >▶</button>
          <button
            type="button"
            onClick={() => setSelected((s) => s ? new Date(s.getFullYear() + 1, s.getMonth(), 1) : new Date(monthStart.getFullYear() + 1, monthStart.getMonth(), 1))}
            title="Año siguiente"
            className="rounded px-2 py-1 text-xs bg-slate-800"
          >»</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
        {['D','L','M','M','J','V','S'].map((d, idx) => (
          <div key={`${d}-${idx}`} className="py-1">{d}</div>
        ))}
        {days.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => d && pickDay(d)}
            className={[
              'h-8 w-8 rounded-md text-sm leading-8',
              d ? 'bg-slate-800 hover:bg-slate-700' : 'bg-transparent',
              d && selected && selected.getDate() === d && selected.getMonth() === monthStart.getMonth() && selected.getFullYear() === monthStart.getFullYear() ? 'ring-2 ring-indigo-500' : ''
            ].filter(Boolean).join(' ')}
            disabled={!d}
          >
            {d ?? ''}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={["relative w-full", containerClassName].filter(Boolean).join(' ')}>
      <Input
        ref={inputRef}
        label={label}
        required={required}
        value={text}
        onChange={onTextChange}
        onFocus={() => setOpen(true)}
        placeholder="DD/MM/YYYY"
        helperText={helperText}
        error={error}
      />

      {open ? createPortal(popup, document.body) : null}
    </div>
  );
}
