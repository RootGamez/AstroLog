import { Modal as HeroModal } from '@heroui/react';
import type { ComponentProps } from 'react';

export function Modal(props: ComponentProps<typeof HeroModal>) {
	return <HeroModal {...props} />;
}
