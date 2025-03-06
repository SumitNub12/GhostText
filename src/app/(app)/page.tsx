import MessageCarousel from '@/components/MessageCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Send, User } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
	const year = new Date().getFullYear();

	return (
		<div
			className='flex flex-col min-h-screen 
            bg-background 
            text-foreground 
            relative 
            overflow-hidden'
		>
			<div
				className='absolute inset-0 
				bg-[radial-gradient(circle_farthest-side,rgba(var(--primary)/0.15),rgba(255,255,255,0))]
				opacity-50
				dark:opacity-30'
			></div>

			<main className='flex-1 relative z-10'>
				<section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 relative'>
					<div className='container px-4 md:px-6 relative'>
						<div
							className='absolute -inset-2 
							bg-gradient-to-r 
							from-primary/20 
							to-secondary/20 
							rounded-3xl 
							blur-2xl 
							opacity-30 
							group-hover:opacity-50 
							transition-opacity 
							duration-500 
							hidden lg:block'
						></div>
						<div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] grid-cols-1 relative'>
							<div className='flex flex-col justify-center space-y-6 px-4 md:px-10 text-center lg:text-left'>
								<div className='space-y-4'>
									<h1
										className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl/none 
                                                 bg-gradient-to-r from-primary to-secondary 
                                                 text-transparent bg-clip-text'
									>
										Share Your Thoughts Anonymously
									</h1>
									<p className='max-w-[600px] text-muted-foreground text-base md:text-xl leading-relaxed mx-auto lg:mx-0'>
										Connect with friends and strangers without revealing your
										identity. Send and receive messages anonymously.
									</p>
								</div>
								<div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4'>
									<Link
										href='/signup'
										className='w-full sm:w-auto'
									>
										<Button
											size='lg'
											className='w-full sm:w-auto bg-primary 
                                                     text-primary-foreground 
                                                     hover:bg-primary/90 
                                                     transition-all duration-300 
                                                     shadow-md hover:shadow-xl
                                                     relative 
                                                     overflow-hidden 
                                                     group'
										>
											<span
												className='absolute inset-0 
												bg-gradient-to-r 
												from-primary/30 
												to-secondary/30 
												opacity-0 
												group-hover:opacity-50 
												transition-opacity 
												duration-300 
												blur-md'
											></span>
											<span className='relative z-10'>Get Started</span>
										</Button>
									</Link>
									<Link
										href='#how-it-works'
										className='w-full sm:w-auto'
									>
										<Button
											size='lg'
											variant='outline'
											className='w-full sm:w-auto border-primary text-primary 
                                                     hover:bg-accent dark:hover:bg-accent 
                                                     transition-colors'
										>
											How It Works
										</Button>
									</Link>
								</div>
							</div>

							{/* Carousel with Glow Effect */}
							<div className='relative group lg:mt-0'>
								<div
									className='absolute -inset-4 
									bg-gradient-to-r 
									from-primary/30 
									to-secondary/30 
									rounded-2xl 
									blur-2xl 
									opacity-0 
									group-hover:opacity-50 
									transition-opacity 
									duration-500 
									animate 
									z-[-1]'
								></div>
								<div
									className='relative z-10 
									rounded-xl 
									shadow-xl 
									hover:shadow-2xl 
									transition-shadow 
									duration-300'
								>
									<MessageCarousel />
								</div>
							</div>
						</div>
					</div>
				</section>

				<section
					id='how-it-works'
					className='w-full py-12 md:py-24 lg:py-32 
                                    bg-accent/50 
                                    backdrop-blur-sm'
				>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-3'>
								<h2
									className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl 
                                               bg-gradient-to-r from-primary to-secondary 
                                               text-transparent bg-clip-text'
								>
									How It Works
								</h2>
								<p className='max-w-[900px] text-muted-foreground text-base md:text-xl/relaxed'>
									Our platform makes anonymous messaging simple, secure, and
									fun.
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-6 py-12'>
							{[
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
									description:
										'Respond to messages while maintaining your anonymity.',
								},
							].map((item, index) => (
								<div
									key={index}
									className='relative group h-full'
								>
									{/* Card Glow Effect */}
									<div
										className='absolute -inset-1 
										bg-gradient-to-r 
										from-primary/20 
										to-secondary/20 
										rounded-xl 
										blur-lg 
										opacity-0 
										group-hover:opacity-50 
										transition-opacity 
										duration-500
										hidden lg:block'
									></div>
									<Card
										className='relative overflow-hidden 
                                           border-border 
                                           shadow-sm hover:shadow-xl 
                                           transform transition-all duration-300 
                                           hover:scale-[1.02] 
                                           bg-card/70 
                                           backdrop-blur-md
                                           h-full'
									>
										<CardContent className='p-6 h-full flex flex-col'>
											<div
												className='flex h-12 w-12 items-center justify-center 
                                                    rounded-full bg-primary/10 
                                                    text-primary mb-4'
											>
												<item.icon className='h-6 w-6' />
											</div>
											<h3 className='text-xl font-bold text-foreground mb-2'>
												{item.title}
											</h3>
											<p className='text-muted-foreground flex-grow'>
												{item.description}
											</p>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
			<footer
				className='border-t border-border 
                              bg-background/50 
                              backdrop-blur-sm py-6 md:py-0 px-4 md:px-10'
			>
				<div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
					<p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
						© {year} Whisper. All rights reserved.
					</p>
					<div className='flex items-center gap-4 flex-wrap justify-center'>
						<Link
							href='/terms'
							className='text-sm text-muted-foreground 
                                       underline-offset-4 hover:underline'
						>
							Terms
						</Link>
						<Link
							href='/privacy'
							className='text-sm text-muted-foreground 
                                       underline-offset-4 hover:underline'
						>
							Privacy
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
