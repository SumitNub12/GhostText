'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const messages = [
	{
		id: 1,
		text: 'This platform is amazing! I can finally share my thoughts without worrying about judgment.',
		name: 'Anonymous User',
		avatar: '/img/aarav.jpg',
		initials: 'AU',
		color: 'bg-primary/10',
	},
	{
		id: 2,
		text: "I've been looking for a safe space to express myself. Whisper is exactly what I needed!",
		name: 'Secret Sharer',
		avatar: '/img/leo.jpg',
		initials: 'SS',
		color: 'bg-secondary/10',
	},
	{
		id: 3,
		text: 'The anonymity gives me confidence to speak my mind. Thank you for creating this!',
		name: 'Hidden Voice',
		avatar: '/img/monica.jpg',
		initials: 'HV',
		color: 'bg-chart-1/10',
	},
	{
		id: 4,
		text: 'I love how easy it is to connect with people without revealing my identity.',
		name: 'Mystery Messenger',
		avatar: '/img/leo.jpg',
		initials: 'MM',
		color: 'bg-chart-2/10',
	},
];

export default function MessageCarousel() {
	const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [direction, setDirection] = useState('next');
	const carouselRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			handleNext();
		}, 5000);

		return () => clearInterval(intervalId);
	}, [currentMessageIndex]);

	const handleNext = () => {
		if (isAnimating) return;

		setIsAnimating(true);
		setDirection('next');
		setTimeout(() => {
			setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
			setIsAnimating(false);
		}, 300);
	};

	const handlePrev = () => {
		if (isAnimating) return;

		setIsAnimating(true);
		setDirection('prev');
		setTimeout(() => {
			setCurrentMessageIndex(
				(prevIndex) => (prevIndex - 1 + messages.length) % messages.length
			);
			setIsAnimating(false);
		}, 300);
	};

	const currentMessage = messages[currentMessageIndex];

	return (
		<div className='p-6 md:p-8 bg-card dark:bg-card min-h-[450px] flex flex-col relative overflow-hidden'>
			<div className='text-2xl font-semibold text-primary mb-6 text-center text-gradient'>
				What People Are Saying
			</div>

			<div className='flex-1 flex items-center justify-center relative'>
				<div
					ref={carouselRef}
					className={`w-full transition-all duration-300 ${
						isAnimating ?
							direction === 'next' ?
								'opacity-0 translate-x-10'
							:	'opacity-0 -translate-x-10'
						:	'opacity-100 translate-x-0'
					}`}
				>
					<div className='message-bubble bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-2xl shadow-lg max-w-md mx-auto'>
						<div className='flex items-start gap-4'>
							<Avatar
								className={`h-12 w-12 border-2 border-primary/20 ${currentMessage.color}`}
							>
								<AvatarImage
									src={currentMessage.avatar}
									alt={currentMessage.name}
								/>
								<AvatarFallback className='text-primary'>
									{currentMessage.initials}
								</AvatarFallback>
							</Avatar>
							<div className='flex-1'>
								<p className='text-lg text-foreground mb-3'>
									{currentMessage.text}
								</p>
								<p className='text-sm text-muted-foreground'>
									{currentMessage.name}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='flex justify-center gap-2 mt-8'>
				{messages.map((_, index) => (
					<button
						key={index}
						onClick={() => {
							setDirection(index > currentMessageIndex ? 'next' : 'prev');
							setCurrentMessageIndex(index);
						}}
						className={`h-2 rounded-full transition-all duration-300 ${
							index === currentMessageIndex ? 'bg-primary w-6' : (
								'bg-primary/30 hover:bg-primary/50 w-2'
							)
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>

			<div className='absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2'>
				<button
					onClick={handlePrev}
					className='bg-background/80 hover:bg-background text-primary rounded-full p-2 shadow-md hover-lift'
					aria-label='Previous testimonial'
				>
					<ChevronLeft className='h-5 w-5' />
				</button>
				<button
					onClick={handleNext}
					className='bg-background/80 hover:bg-background text-primary rounded-full p-2 shadow-md hover-lift'
					aria-label='Next testimonial'
				>
					<ChevronRight className='h-5 w-5' />
				</button>
			</div>

			{/* Decorative elements */}
			<div className='absolute top-10 right-10 w-20 h-20 rounded-full bg-primary/5 animate-pulse-glow'></div>
			<div
				className='absolute bottom-10 left-10 w-16 h-16 rounded-full bg-secondary/5 animate-pulse-glow'
				style={{ animationDelay: '1s' }}
			></div>
			<div
				className='absolute top-1/3 left-5 w-4 h-4 rounded-full bg-primary/10 animate-float'
				style={{ animationDelay: '0.5s' }}
			></div>
			<div
				className='absolute bottom-1/3 right-5 w-6 h-6 rounded-full bg-secondary/10 animate-float'
				style={{ animationDelay: '1.5s' }}
			></div>
		</div>
	);
}
