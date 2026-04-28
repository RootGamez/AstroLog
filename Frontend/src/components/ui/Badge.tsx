import type { HTMLAttributes, MouseEventHandler } from 'react';

type BadgeColor = 'default' | 'indigo' | 'danger';
type BadgeVariant = 'solid' | 'subtle' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLElement> {
	color?: BadgeColor;
	variant?: BadgeVariant;
	onClick?: MouseEventHandler<HTMLElement>;
}

const palette: Record<BadgeVariant, Record<BadgeColor, string>> = {
	solid: {
		default: 'bg-slate-700 text-slate-100',
		indigo: 'bg-indigo-600 text-indigo-50',
		danger: 'bg-rose-600 text-rose-50',
	},
	subtle: {
		default: 'bg-slate-700/30 text-slate-200 border border-slate-500/40',
		indigo: 'bg-indigo-700/30 text-indigo-100 border border-indigo-500/40',
		danger: 'bg-rose-700/30 text-rose-100 border border-rose-500/40',
	},
	outline: {
		default: 'border border-slate-500 text-slate-200',
		indigo: 'border border-indigo-500 text-indigo-200',
		danger: 'border border-rose-500 text-rose-200',
	},
};

export function Badge({ color = 'default', variant = 'subtle', className, onClick, children, ...props }: BadgeProps) {
	const classes = [
		'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150',
		onClick ? 'cursor-pointer hover:scale-[1.02]' : '',
		palette[variant][color],
		className,
	]
		.filter(Boolean)
		.join(' ');

	if (onClick) {
		return (
			<button type="button" className={classes} onClick={onClick} {...props}>
				{children}
			</button>
		);
	}

	return (
		<span className={classes} {...props}>
			{children}
		</span>
	);
}
