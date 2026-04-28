import { TextArea as HeroTextArea } from '@heroui/react';
import type { ComponentProps } from 'react';

export function TextArea(props: ComponentProps<typeof HeroTextArea>) {
	return <HeroTextArea {...props} />;
}
