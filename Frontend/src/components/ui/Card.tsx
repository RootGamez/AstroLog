import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardSectionProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

function CardRoot({ className, children, ...props }: CardSectionProps) {
	return (
		<article
			className={[
				'rounded-2xl border border-indigo-900/70 bg-slate-950/70 shadow-xl backdrop-blur-sm',
				className,
			]
				.filter(Boolean)
				.join(' ')}
			{...props}
		>
			{children}
		</article>
	);
}

function CardHeader({ className, children, ...props }: CardSectionProps) {
	return (
		<header className={['border-b border-indigo-900/60 p-4', className].filter(Boolean).join(' ')} {...props}>
			{children}
		</header>
	);
}

function CardContent({ className, children, ...props }: CardSectionProps) {
	return (
		<div className={['p-4', className].filter(Boolean).join(' ')} {...props}>
			{children}
		</div>
	);
}

function CardFooter({ className, children, ...props }: CardSectionProps) {
	return (
		<footer className={['border-t border-indigo-900/60 p-4', className].filter(Boolean).join(' ')} {...props}>
			{children}
		</footer>
	);
}

export const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Content: CardContent,
	Footer: CardFooter,
});
