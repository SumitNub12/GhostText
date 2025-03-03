'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiResponse } from '../../../types/ApiResponse';
import { User } from 'next-auth';

const Dashboard = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);
	const { data: session } = useSession();

	const form = useForm({
		resolver: zodResolver(acceptMessageSchema),
		defaultValues: {
			acceptMessages: false,
		},
	});

	const { register, watch, setValue } = form;
	const acceptMessages = watch('acceptMessages');

	const handleDeleteMessage = (messageId: string) => {
		setMessages((prevMessages) =>
			prevMessages.filter((message) => message._id !== messageId)
		);
	};

	const fetchAcceptMessage = useCallback(async () => {
		setIsSwitchLoading(true);

		try {
			const response = await axios.get<ApiResponse>('/api/accept-messages');
			setValue('acceptMessages', response.data.isAcceptingMessages!);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error(
				axiosError.response?.data.message ?? 'Failed to fetch accept messages'
			);
		} finally {
			setIsSwitchLoading(false);
		}
	}, [setValue]);

	const fetchMessages = useCallback(async (refresh?: boolean) => {
		setIsLoading(true);

		try {
			const response = await axios.get<ApiResponse>('/api/get-messages');
			setMessages(response.data.messages || []);

			if (refresh) {
				toast('Refreshed Messages', { description: 'Showing latest messages' });
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error(
				axiosError.response?.data.message ?? 'Failed to fetch messages'
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!session || !session.user) return;

		fetchMessages();
		fetchAcceptMessage();
	}, [session, fetchMessages, fetchAcceptMessage]);

	const handleSwitchChange = async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.post<ApiResponse>('/api/accept-messages', {
				acceptMessages: !acceptMessages,
			});

			setValue('acceptMessages', !acceptMessages);
			toast.success(response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error(
				axiosError.response?.data.message ?? 'Failed to update message settings'
			);
		} finally {
			setIsSwitchLoading(false);
		}
	};

	if (!session || !session.user) return <div>Please Login</div>;

	const { username } = session.user as User;
	const baseUrl =
		typeof window !== 'undefined' ?
			`${window.location.protocol}//${window.location.host}`
		:	'';
	const profileUrl = `${baseUrl}/u/${username}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(profileUrl);
		toast.success('Profile URL has been copied to clipboard');
	};

	return (
		<div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
			<h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

			<div className='mb-4'>
				<h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
				<div className='flex items-center'>
					<input
						type='text'
						value={profileUrl}
						disabled
						className='input input-bordered w-full p-2 mr-2'
					/>
					<Button onClick={copyToClipboard}>Copy</Button>
				</div>
			</div>

			<div className='mb-4 flex items-center'>
				<Switch
					id='accept-messages'
					checked={acceptMessages}
					onCheckedChange={handleSwitchChange}
					disabled={isSwitchLoading}
				/>
				<label
					htmlFor='accept-messages'
					className='ml-2'
				>
					Accept Messages: {acceptMessages ? 'On' : 'Off'}
				</label>
			</div>
			<Separator />

			<Button
				className='mt-4'
				variant='outline'
				onClick={() => fetchMessages(true)}
				disabled={isLoading}
			>
				{isLoading ?
					<Loader2 className='h-4 w-4 animate-spin' />
				:	<RefreshCcw className='h-4 w-4' />}
				<span className='ml-2'>Refresh</span>
			</Button>

			<div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
				{messages.length > 0 ?
					messages.map((message) => (
						<MessageCard
							key={message._id as string}
							message={message}
							onMessageDelete={handleDeleteMessage}
						/>
					))
				:	<p>No messages to display.</p>}
			</div>
		</div>
	);
};

export default Dashboard;
