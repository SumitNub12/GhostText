'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import messages from '@/data/messages.json';
import Autoplay from 'embla-carousel-autoplay';
import { Mail } from 'lucide-react';
import { useRef } from 'react';

export default function MessageCarousel() {
	const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

	return (
		<div className='max-w-full w-full md:max-w-xl ml-0 md:-ml-8 lg:-ml-12 xl:-ml-16'>
			<Carousel
				plugins={[plugin.current]}
				className='w-full'
				onMouseEnter={plugin.current.stop}
				onMouseLeave={plugin.current.reset}
			>
				<CarouselContent>
					{messages.map((message, index) => (
						<CarouselItem
							key={index}
							className='p-4'
						>
							<Card
								className='hover:shadow-lg transition-shadow duration-300 
                                           border-gray-200 dark:border-gray-700 
                                           bg-white dark:bg-gray-800'
							>
								<CardHeader className=' border-gray-100 dark:border-gray-700'>
									<CardTitle className=' text-lg font-semibold text-gray-800 dark:text-gray-200'>
										{message.title}
									</CardTitle>
								</CardHeader>
								<CardContent
									className='flex flex-col items-start space-y-2 
                                               md:flex-row md:space-x-4 md:space-y-0 
                                               py-4 px-6'
								>
									<Mail
										className='flex-shrink-0 text-blue-600 dark:text-blue-400 
                                                   w-10 h-10 md:w-8 md:h-8'
									/>
									<div className='space-y-1'>
										<p className='text-gray-700 dark:text-gray-300'>
											{message.content}
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-500'>
											{message.received}
										</p>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}
