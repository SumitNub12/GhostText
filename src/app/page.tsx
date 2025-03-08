import MessageCarousel from '@/components/MessageCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	ArrowRight,
	ChevronRight,
	MessageCircle,
	Send,
	User,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	const year = new Date().getFullYear();

	const features = [
		{
			icon: User,
			title: 'Create Your Profile',
			description:
				'Sign up with a username and password. Your real identity stays hidden.',
		},
		{
			icon: Send,
			title: 'Send Messages',
			description:
				'Share your link and receive anonymous messages from anyone.',
		},
		{
			icon: MessageCircle,
			title: 'Reply Anonymously',
			description: 'Respond to messages while maintaining your anonymity.',
		},
	];

	return (
		<div className='overflow-hidden max-w-full'>
			<div className='flex flex-col min-h-screen bg-animate'>
				{/* Background Overlay */}
				<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary)/0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(var(--secondary)/0.15),transparent_50%)] opacity-70 dark:opacity-40 animate-pulse-glow overflow-hidden' />

				<main className='flex-1 relative z-10 overflow-hidden'>
					<section className='w-full py-16 md:py-24 lg:py-32'>
						<div className='container mx-auto px-4 md:px-6 relative'>
							<div className='grid gap-12 lg:grid-cols-2 items-center'>
								<div className='flex flex-col space-y-8 text-center lg:text-left animate-slide-up'>
									<div className='space-y-2'>
										<div className='inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4 animate-fade-in'>
											Anonymous Messaging Platform
										</div>
										<h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
											Share Your Thoughts{' '}
											<span className='text-gradient'>Anonymously</span>
										</h1>
										<p className='text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto lg:mx-0 mt-4 animate-slide-up delay-200'>
											Connect with friends and strangers without revealing your
											identity. Express yourself freely in a safe space.
										</p>
									</div>
									<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up delay-300'>
										<Link href='/signup'>
											<Button
												size='lg'
												className='w-full sm:w-auto group relative overflow-hidden font-medium btn-pulse'
											>
												<span className='relative z-10 flex items-center'>
													Get Started{' '}
													<ChevronRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
												</span>
											</Button>
										</Link>
										<Link href='#how-it-works'>
											<Button
												size='lg'
												variant='outline'
												className='w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/5 hover-lift'
											>
												How It Works
											</Button>
										</Link>
									</div>
								</div>

								<div className='relative group animate-float'>
									<div className='absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-[-1]' />
									<div className='rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] overflow-hidden border border-primary/10 animate-scale-in'>
										<MessageCarousel />
									</div>
								</div>
							</div>
						</div>
					</section>

					<section
						id='how-it-works'
						className='w-full py-16 md:py-24 bg-gradient-to-b from-accent/30 to-accent/10 backdrop-blur-sm animate-gradient-shift'
					>
						<div className='container mx-auto px-4 md:px-6'>
							<div className='text-center mb-16 animate-slide-up'>
								<div className='inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4'>
									Simple Process
								</div>
								<h2 className='text-3xl font-bold sm:text-4xl md:text-5xl text-gradient'>
									How It Works
								</h2>
								<p className='mt-4 text-muted-foreground text-lg max-w-[800px] mx-auto'>
									Our platform makes anonymous messaging simple, secure, and
									fun.
								</p>
							</div>

							<div className='grid md:grid-cols-3 gap-8'>
								{features.map((feature, index) => (
									<div
										key={index}
										className={`animate-slide-up delay-${(index + 1) * 100}`}
									>
										<Card className='h-full card-hover bg-card/80 backdrop-blur-md border-primary/10 overflow-hidden relative'>
											<CardContent className='p-8 flex flex-col relative z-10'>
												<div className='flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary mb-6 animate-bounce-subtle'>
													<feature.icon className='h-6 w-6' />
												</div>
												<h3 className='text-2xl font-bold mb-3'>
													{feature.title}
												</h3>
												<p className='text-muted-foreground'>
													{feature.description}
												</p>
											</CardContent>
										</Card>
									</div>
								))}
							</div>
						</div>
					</section>

					<section className='w-full py-16 md:py-20 relative overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-gradient-shift'></div>
						<div className='container mx-auto px-4 md:px-6 relative'>
							<div className='max-w-3xl mx-auto text-center animate-slide-up'>
								<h2 className='text-3xl font-bold mb-4 text-gradient'>
									Ready to Get Started?
								</h2>
								<p className='text-muted-foreground text-lg mb-8'>
									Join thousands of users already sharing their thoughts
									anonymously.
								</p>
								<Link href='/sign-up'>
									<Button
										size='lg'
										className='group hover-glow'
									>
										Create Your Profile
										<ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
									</Button>
								</Link>
							</div>
						</div>
					</section>
				</main>

				<footer className='border-t border-primary/10 bg-background/80 backdrop-blur-sm py-8'>
					<div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
						<p className='text-sm text-muted-foreground'>
							© {year} Whisper. All rights reserved.
						</p>
						<div className='flex gap-6'>
							<Link
								href='/terms'
								className='text-sm text-muted-foreground hover:text-primary transition-colors'
							>
								Terms
							</Link>
							<Link
								href='/privacy'
								className='text-sm text-muted-foreground hover:text-primary transition-colors'
							>
								Privacy
							</Link>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
