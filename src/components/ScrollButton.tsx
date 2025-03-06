'use client';

import { Button } from '@/components/ui/button';

export default function ScrollButton() {
	const handleScroll = () => {
		const section = document.getElementById('how-it-works');
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<Button
			size='lg'
			variant='outline'
			className='border-primary text-primary hover:bg-accent dark:hover:bg-accent transition-colors'
			onClick={handleScroll}
		>
			How It Works
		</Button>
	);
}
