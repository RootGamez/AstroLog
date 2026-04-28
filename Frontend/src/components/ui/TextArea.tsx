import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	helperText?: string;
	error?: string;
	containerClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
	{ label, helperText, error, containerClassName, className, id, required, rows = 4, ...props },
	ref
) {
	const generatedId = useId();
	const textAreaId = id ?? generatedId;

	const textAreaClasses = [
		'w-full rounded-md border bg-slate-950/70 px-3 py-2 text-sm text-slate-100',
		'placeholder:text-slate-400 transition-colors duration-150',
		'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
		error ? 'border-rose-500' : 'border-indigo-800/60',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={["w-full", containerClassName].filter(Boolean).join(' ')}>
			{label ? (
				<label htmlFor={textAreaId} className="mb-1 block text-sm font-medium text-indigo-100">
					{label}
					{required ? <span className="ml-1 text-rose-400">*</span> : null}
				</label>
			) : null}
			<textarea ref={ref} id={textAreaId} required={required} rows={rows} className={textAreaClasses} {...props} />
			{error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
			{!error && helperText ? <p className="mt-1 text-xs text-slate-400">{helperText}</p> : null}
		</div>
	);
});
