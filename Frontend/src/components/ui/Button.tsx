import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ButtonColor = 'default' | 'primary' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	loading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
	xs: 'h-7 px-2 text-xs',
	sm: 'h-9 px-3 text-sm',
	md: 'h-10 px-4 text-sm',
	lg: 'h-12 px-6 text-base',
};

const variantClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
	solid: {
		default: 'bg-slate-700 text-white hover:bg-slate-600',
		primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
		danger: 'bg-rose-600 text-white hover:bg-rose-500',
	},
	outline: {
		default: 'border border-slate-500 text-slate-100 hover:bg-slate-800/50',
		primary: 'border border-indigo-500 text-indigo-200 hover:bg-indigo-900/40',
		danger: 'border border-rose-500 text-rose-200 hover:bg-rose-900/30',
	},
	ghost: {
		default: 'text-slate-100 hover:bg-slate-800/60',
		primary: 'text-indigo-200 hover:bg-indigo-900/40',
		danger: 'text-rose-200 hover:bg-rose-900/30',
	},
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		variant = 'solid',
		color = 'default',
		size = 'md',
		className,
		loading = false,
		disabled,
		children,
		...props
	},
	ref
) {
	const classes = [
		'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
		'disabled:cursor-not-allowed disabled:opacity-60',
		sizeClasses[size],
		variantClasses[variant][color],
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<button ref={ref} className={classes} disabled={disabled || loading} {...props}>
			{loading ? (
				<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
			) : null}
			{children}
		</button>
	);
});
