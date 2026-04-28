import { Input as HeroInput } from '@heroui/react';
import type { ComponentProps } from 'react';

export function Input(props: ComponentProps<typeof HeroInput>) {
	return <HeroInput {...props} />;
}
