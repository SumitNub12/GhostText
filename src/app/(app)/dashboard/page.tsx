'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Message } from '@/model/User';
import axios, { AxiosError } from 'axios';

import { Loader2, RefreshCcw, Search, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useDebounceCallback } from 'usehooks-ts';
import { ApiResponse } from '../../../types/ApiResponse';
// import { formatDistanceToNowStrict } from 'date-fns'; // showing errors

const { formatDistanceToNowStrict } = require('date-fns');

const Dashboard = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);
	const [acceptMessages, setAcceptMessages] = useState(false);

	// Separate states for input and search
	const [inputQuery, setInputQuery] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const [currentPage, setCurrentPage] = useState(1);
	const messagesPerPage = 5;

	const { data: session } = useSession();

	// Debounce the search query to improve performance
	const debouncedSearch = useDebounceCallback((query: string) => {
		setSearchQuery(query);
	}, 500);

	// Fetch messages from the server
	const fetchMessages = useCallback(
		async (refresh: boolean = false) => {
			if (!session?.user) return;
			setIsLoading(true);
			setIsSwitchLoading(true);
			try {
				const response = await axios.get<ApiResponse>('/api/get-messages');
				setMessages(response.data.messages || []);
				setFilteredMessages(response.data.messages || []);

				if (refresh) {
					toast.info('Refreshed Messages', {
						description: 'Showing latest messages',
					});
				}
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				toast.error(
					axiosError.response?.data.message ?? 'Failed to fetch messages'
				);
			} finally {
				setIsLoading(false);
				setIsSwitchLoading(false);
			}
		},
		[session]
	);

	// Fetch accept messages status
	const fetchAcceptMessage = useCallback(async () => {
		if (!session?.user) return;
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>('/api/accept-messages');
			setAcceptMessages(response.data.isAcceptingMessages!);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error(
				axiosError.response?.data.message ?? 'Failed to fetch accept messages'
			);
		} finally {
			setIsSwitchLoading(false);
		}
	}, [session]);

	useEffect(() => {
		if (!session || !session.user) return;

		const fetchData = async () => {
			await Promise.all([fetchMessages(), fetchAcceptMessage()]);
		};

		fetchData();
	}, [session, fetchAcceptMessage, fetchMessages]);

	// Handle switch toggle for accepting messages
	const handleSwitchChange = async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.post<ApiResponse>('/api/accept-messages', {
				acceptMessages: !acceptMessages,
			});

			setAcceptMessages(!acceptMessages);
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

	// Delete a message
	const handleDeleteMessage = (messageId: string) => {
		setMessages((prevMessages) =>
			prevMessages.filter((message) => message._id !== messageId)
		);
		setFilteredMessages((prevMessages) =>
			prevMessages.filter((message) => message._id !== messageId)
		);
	};

	// Search messages on the client side
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredMessages(messages); // Reset to all messages if query is empty
			setCurrentPage(1);
			return;
		}

		const filtered = messages.filter((message) =>
			message.content.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredMessages(filtered);
		setCurrentPage(1); // Reset to the first page after filtering
	}, [searchQuery, messages]);

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputQuery(value);
		debouncedSearch(value);
	};

	// Calculate paginated messages
	const paginatedMessages = () => {
		const startIndex = (currentPage - 1) * messagesPerPage;
		const endIndex = startIndex + messagesPerPage;
		return filteredMessages.slice(startIndex, endIndex);
	};

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (!session || !session.user) return <div>Please Login</div>;

	const { username } = session.user;
	const baseUrl =
		typeof window !== 'undefined' ?
			`${window.location.protocol}//${window.location.host}`
		:	'';
	const profileUrl = `${baseUrl}/u/${username}`;

	// Copy profile URL to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(profileUrl);
		toast.success('Profile URL has been copied to clipboard');
	};

	return (
		<main className='flex-1 container py-6 px-4 md:px-20'>
			{/* Restructured header section for responsiveness */}
			<div className='flex flex-col space-y-4 mb-6 md:space-y-0 md:flex-row md:items-center md:justify-between'>
				{/* Search box appears first on small screens */}
				<div className='relative w-full md:max-w-sm md:order-2'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search messages...'
						className='pl-8'
						value={inputQuery}
						onChange={handleInputChange}
					/>
				</div>
				{/* Heading appears second on small screens */}
				<h1 className='text-2xl md:text-3xl font-bold md:order-1'>
					User Dashboard
				</h1>
			</div>

			<div className='mb-4 flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between'>
				<div className='flex items-center'>
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

				<div className='flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center'>
					<Input
						type='text'
						value={profileUrl}
						disabled
						className='input input-bordered w-full sm:max-w-sm p-2 sm:mr-2'
					/>
					<Button
						className='w-full sm:w-auto'
						onClick={copyToClipboard}
					>
						Copy
					</Button>
				</div>
			</div>

			<Tabs
				defaultValue='received'
				className='w-full'
			>
				<TabsList className='grid w-full max-w-md grid-cols-2 mb-6'>
					<TabsTrigger value='received'>Received</TabsTrigger>
					<TabsTrigger value='sent'>Sent</TabsTrigger>
				</TabsList>

				<TabsContent
					value='received'
					className='space-y-4'
				>
					<Button
						variant='outline'
						onClick={() => fetchMessages(true)}
						disabled={isLoading}
						className='mb-4'
					>
						{isLoading ?
							<Loader2 className='h-4 w-4 animate-spin' />
						:	<RefreshCcw className='h-4 w-4' />}
						<span className='ml-2'>Refresh</span>
					</Button>

					{paginatedMessages().length > 0 ?
						paginatedMessages().map((message) => (
							<Card key={message._id}>
								<CardContent className='p-4 sm:p-6'>
									<div className='flex items-start justify-between gap-2 sm:gap-4'>
										<div className='flex-1 space-y-1'>
											<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
												<p className='text-sm font-medium text-muted-foreground'>
													Anonymous •{' '}
													{message.createdAt ?
														formatDistanceToNowStrict(
															new Date(message.createdAt),
															{
																addSuffix: true,
															}
														)
													:	'Unknown'}
												</p>
												<Button
													variant='ghost'
													size='icon'
													className='h-8 w-8 self-end sm:self-auto'
													onClick={() =>
														handleDeleteMessage(message._id as string)
													}
												>
													<Trash className='h-4 w-4 text-destructive' />
													<span className='sr-only'>Delete</span>
												</Button>
											</div>
											<p className='text-base'>{message.content}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					:	<p className='text-center text-muted-foreground'>
							No messages to display.
						</p>
					}

					{/* Pagination with responsive styling */}
					<Pagination>
						<PaginationContent className='flex flex-wrap justify-center gap-1'>
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										currentPage > 1 && handlePageChange(currentPage - 1)
									}
									className={
										currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
									}
								/>
							</PaginationItem>
							{Array.from(
								{
									length: Math.ceil(filteredMessages.length / messagesPerPage),
								},
								(_, i) => (
									<PaginationItem key={i + 1}>
										<PaginationLink
											isActive={currentPage === i + 1}
											onClick={() => handlePageChange(i + 1)}
										>
											{i + 1}
										</PaginationLink>
									</PaginationItem>
								)
							)}
							<PaginationItem>
								<PaginationNext
									onClick={() =>
										currentPage <
											Math.ceil(filteredMessages.length / messagesPerPage) &&
										handlePageChange(currentPage + 1)
									}
									className={
										(
											currentPage >=
											Math.ceil(filteredMessages.length / messagesPerPage)
										) ?
											'cursor-not-allowed opacity-50'
										:	''
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</TabsContent>

				<TabsContent
					value='sent'
					className='space-y-4'
				>
					<p className='text-center text-muted-foreground'>
						No sent messages available.
					</p>
				</TabsContent>
			</Tabs>
		</main>
	);
};

export default Dashboard;
