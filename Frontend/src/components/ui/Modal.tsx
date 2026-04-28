import { useEffect } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';

export interface ModalProps extends PropsWithChildren {
	open: boolean;
	onClose: () => void;
	title?: string;
	footer?: ReactNode;
	className?: string;
}

export function Modal({ open, onClose, title, footer, className, children }: ModalProps) {
	useEffect(() => {
		if (!open) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', handleEscape);

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener('keydown', handleEscape);
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Cerrar modal"
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={onClose}
			/>
			<section
				role="dialog"
				aria-modal="true"
				className={[
					'relative z-10 w-full max-w-2xl rounded-2xl border border-indigo-800/70 bg-slate-950 text-slate-100 shadow-2xl',
					className,
				]
					.filter(Boolean)
					.join(' ')}
			>
				{title ? (
					<header className="flex items-center justify-between border-b border-indigo-900/60 px-6 py-4">
						<h2 className="text-lg font-semibold text-indigo-100">{title}</h2>
						<button
							type="button"
							className="rounded-md px-2 py-1 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
							onClick={onClose}
						>
							Cerrar
						</button>
					</header>
				) : null}
				<div className="p-6">{children}</div>
				{footer ? <footer className="border-t border-indigo-900/60 px-6 py-4">{footer}</footer> : null}
			</section>
		</div>
	);
}
