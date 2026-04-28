import { Badge as HeroBadge } from '@heroui/react';
import type { ComponentProps } from 'react';

export function Badge(props: ComponentProps<typeof HeroBadge>) {
	return <HeroBadge {...props} />;
}
