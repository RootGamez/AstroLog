import { Card as HeroCard } from '@heroui/react';
import type { ComponentProps } from 'react';

export const Card = Object.assign(
	function Card(props: ComponentProps<typeof HeroCard>) {
		return <HeroCard {...props} />;
	},
	{
		Header: HeroCard.Header,
		Content: HeroCard.Content,
		Footer: HeroCard.Footer,
	}
);
