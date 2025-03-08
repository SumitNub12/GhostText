'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {
	Copy,
	Eye,
	Loader2,
	MessageCircle,
	Send,
	Sparkles,
	Wand2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
	if (!messageString || typeof messageString !== 'string') return [];

	const messages =
		messageString.includes(specialChar) ?
			messageString.split(specialChar)
		:	messageString.replace(/\n/g, ` ${specialChar} `).split(specialChar);

	return messages.map((msg) => msg.trim()).filter((msg) => msg.length > 0);
};

export default function AnonymousMessagePage() {
	const params = useParams();
	const username = params.username as string;

	const [isLoading, setIsLoading] = useState(false);
	const [isSuggestLoading, setIsSuggestLoading] = useState(false);
	const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
		"What's your favorite movie?",
		'Do you have any pets?',
		"What's your dream job?",
	]);
	const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
	});

	const handleMessageClick = (message: string) => {
		form.setValue('content', message);
	};

	const messageContent = form.watch('content');

	const onSubmit = async (data: z.infer<typeof messageSchema>) => {
		setIsLoading(true);

		try {
			await axios.post<ApiResponse>('/api/send-message', {
				...data,
				username,
			});

			toast.success('Message sent successfully');
			form.reset({ ...form.getValues(), content: '' });
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error(
				axiosError.response?.data.message ?? 'Failed to send message'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchSuggestedMessages = async () => {
		setIsSuggestLoading(true);
		setError(null);

		try {
			const response = await axios.post<{ questions: string }>(
				'/api/suggest-messages'
			);
			const messages = parseStringMessages(response.data.questions);
			setSuggestedMessages(messages);
		} catch (err) {
			console.error('AI Fetch Error:', err);
			setError('Failed to fetch suggested messages');
			toast.error('Failed to fetch suggested messages');
		} finally {
			setIsSuggestLoading(false);
		}
	};

	const copyProfileLink = () => {
		const profileLink = `${window.location.origin}/u/${username}`;
		navigator.clipboard.writeText(profileLink);
		toast.success('Profile link copied to clipboard');
	};

	return (
		<div className='min-h-screen bg-animate'>
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary)/0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(var(--secondary)/0.15),transparent_50%)] opacity-70 dark:opacity-40 animate-pulse-glow' />

			<main className='relative z-10 py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-2xl mx-auto space-y-8'>
					<div className='text-center animate-slide-up'>
						<div className='inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4'>
							Anonymous Messenger
						</div>
						<h1 className='text-4xl font-extrabold text-gradient mb-4'>
							Send a Message
						</h1>
						<p className='text-muted-foreground'>
							Write to @{username} anonymously
						</p>
					</div>

					<Card className='shadow-lg bg-card/80 backdrop-blur-sm border-primary/10 card-hover animate-slide-up delay-100'>
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
								<span className='flex items-center gap-2'>
									<MessageCircle className='h-5 w-5' />
									Write Your Message
								</span>
								<Button
									variant='outline'
									size='sm'
									onClick={copyProfileLink}
									className='hover-lift'
								>
									<Copy className='mr-2 h-4 w-4' /> Share Profile
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-6'
								>
									<FormField
										control={form.control}
										name='content'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Your Message</FormLabel>
												<FormControl>
													<Textarea
														placeholder='Write your anonymous message here...'
														className='resize-none min-h-[150px] max-h-[300px] bg-background/50'
														disabled={isSuggestLoading || isLoading}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className='flex justify-center'>
										<Button
											type='submit'
											size='lg'
											disabled={
												isLoading || !messageContent || isSuggestLoading
											}
											className='hover-glow btn-pulse'
										>
											{isLoading ?
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											:	<Send className='mr-2 h-4 w-4' />}
											Send Message
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>

					<Card className='shadow-md bg-card/80 backdrop-blur-sm border-primary/10 animate-slide-up delay-200'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-xl flex items-center gap-2'>
								<Sparkles className='h-5 w-5' />
								Message Ideas
							</CardTitle>
							<Button
								variant='ghost'
								size='sm'
								onClick={fetchSuggestedMessages}
								disabled={isSuggestLoading || isLoading}
								className='hover-lift'
							>
								{isSuggestLoading ?
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								:	<Wand2 className='mr-2 h-4 w-4' />}
								Generate New
							</Button>
						</CardHeader>
						<CardContent>
							{error ?
								<p className='text-destructive'>{error}</p>
							: isSuggestLoading ?
								<div className='flex items-center justify-center p-8'>
									<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
								</div>
							: suggestedMessages.length > 0 ?
								<div className='space-y-3'>
									{suggestedMessages.map((message, index) => (
										<div
											key={index}
											className='flex items-center space-x-2 animate-slide-up'
											style={{ animationDelay: `${index * 100}ms` }}
										>
											<Button
												variant='outline'
												className='flex-1 overflow-hidden justify-start text-left hover-lift bg-background/50'
												onClick={() => handleMessageClick(message)}
											>
												<Sparkles className='mr-2 h-4 w-4 text-primary flex-shrink-0' />
												<span className='line-clamp-2'>{message}</span>
											</Button>
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
														className='hover-lift'
														onClick={() => setSelectedMessage(message)}
													>
														<Eye className='h-4 w-4' />
													</Button>
												</DialogTrigger>
												<DialogContent className='bg-card/80 backdrop-blur-sm border-primary/10'>
													<DialogHeader>
														<DialogTitle>Message Preview</DialogTitle>
													</DialogHeader>
													<div className='p-4 bg-background/50 rounded-lg'>
														<p className='text-foreground'>{selectedMessage}</p>
													</div>
													<div className='flex justify-end space-x-2'>
														<Button
															variant='outline'
															onClick={() => {
																if (selectedMessage) {
																	handleMessageClick(selectedMessage);
																}
															}}
															className='hover-lift'
														>
															Use Message
														</Button>
													</div>
												</DialogContent>
											</Dialog>
										</div>
									))}
								</div>
							:	<p className='text-muted-foreground text-center'>
									No suggested messages available.
								</p>
							}
						</CardContent>
					</Card>

					<div className='text-center animate-slide-up delay-300'>
						<p className='text-muted-foreground mb-4'>
							Want your own message board?
						</p>
						<Link href='/sign-up'>
							<Button
								variant='outline'
								className='hover-lift border-primary/50'
							>
								Create Your Profile
							</Button>
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
