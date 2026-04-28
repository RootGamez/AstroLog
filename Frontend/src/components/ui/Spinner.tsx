import type { HTMLAttributes } from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	size?: SpinnerSize;
}

const sizeMap: Record<SpinnerSize, string> = {
	sm: 'h-4 w-4 border-2',
	md: 'h-6 w-6 border-2',
	lg: 'h-9 w-9 border-[3px]',
};

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
	return (
		<div
			role="status"
			aria-label="Cargando"
			className={[
				'inline-block animate-spin rounded-full border-indigo-300/70 border-t-transparent',
				sizeMap[size],
				className,
			]
				.filter(Boolean)
				.join(' ')}
			{...props}
		/>
	);
}
