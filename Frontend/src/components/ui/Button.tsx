import { Button as HeroButton } from '@heroui/react';
import type { ComponentProps } from 'react';

export function Button(props: ComponentProps<typeof HeroButton>) {
	return <HeroButton {...props} />;
}
