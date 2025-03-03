'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Separator } from '@radix-ui/react-separator';
import axios, { AxiosError } from 'axios';
import { Link, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const specialChar = '||';

// Ensure AI response is correctly formatted
const parseStringMessages = (messageString: string): string[] => {
	if (!messageString || typeof messageString !== 'string') return [];

	// Ensure AI response follows "||" format
	const messages =
		messageString.includes(specialChar) ?
			messageString.split(specialChar)
		:	messageString.replace(/\n/g, ` ${specialChar} `).split(specialChar);

	return messages.map((msg) => msg.trim()).filter((msg) => msg.length > 0);
};

export default function Page() {
	const params = useParams();
	const username = params.username as string;

	const [isLoading, setIsLoading] = useState(false);
	const [isSuggestLoading, setIsSuggestLoading] = useState(false);
	const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
		"What's your favorite movie?",
		'Do you have any pets?',
		"What's your dream job?",
	]);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
	});

	const handleMessageClick = (message: string) => {
		form.setValue('content', message);
	};

	const messageContent = form.watch('content');

	// Handle form submission
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

	// Fetch Suggested Messages
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

	return (
		<div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
			<h1 className='text-4xl font-bold mb-6 text-center'>
				Public Profile Link
			</h1>
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
								<FormLabel>Send Anonymous Message to @{username}</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Write your anonymous message here'
										className='resize-none'
										disabled={isSuggestLoading || isLoading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-center'>
						{isLoading ?
							<Button disabled>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Please wait
							</Button>
						:	<Button
								type='submit'
								disabled={isLoading || !messageContent || isSuggestLoading}
							>
								Send It
							</Button>
						}
					</div>
				</form>
			</Form>

			<div className='space-y-4 my-8'>
				<div className='space-y-2'>
					<Button
						onClick={fetchSuggestedMessages}
						className='my-4'
						disabled={isSuggestLoading || isLoading}
					>
						{isSuggestLoading ?
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Loading...
							</>
						:	'Suggest Messages'}
					</Button>
					<p>Click on any message below to select it.</p>
				</div>
				<Card>
					<CardHeader>
						<h3 className='text-xl font-semibold'>Messages</h3>
					</CardHeader>
					<CardContent className='flex flex-col space-y-4'>
						{error ?
							<p className='text-red-500'>{error}</p>
						: isSuggestLoading ?
							<div className='flex items-center justify-center'>
								<Loader2 className='h-6 w-6 animate-spin text-gray-500' />
							</div>
						: suggestedMessages.length > 0 ?
							suggestedMessages.map((message, index) => (
								<Button
									key={index}
									variant='outline'
									className='mb-2'
									onClick={() => handleMessageClick(message)}
								>
									{message}
								</Button>
							))
						:	<p>No suggested messages available.</p>}
					</CardContent>
				</Card>
			</div>
			<Separator className='my-6' />
			<div className='text-center'>
				<div className='mb-4'>Get Your Message Board</div>
				<Link href={'/sign-up'}>
					<Button>Create Your Account</Button>
				</Link>
			</div>
		</div>
	);
}
