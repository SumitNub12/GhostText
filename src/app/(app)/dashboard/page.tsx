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
import {
	Link as LinkIcon,
	Loader2,
	MessageCircle,
	RefreshCcw,
	Search,
	Trash,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';
import { ApiResponse } from '../../../types/ApiResponse';

const { formatDistanceToNowStrict } = require('date-fns');

const Dashboard = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);
	const [acceptMessages, setAcceptMessages] = useState(false);
	const [inputQuery, setInputQuery] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const messagesPerPage = 5;

	const { data: session } = useSession();

	const debouncedSearch = useDebounceCallback((query: string) => {
		setSearchQuery(query);
	}, 500);

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

	const handleDeleteMessage = (messageId: string) => {
		setMessages((prevMessages) =>
			prevMessages.filter((message) => message._id !== messageId)
		);
		setFilteredMessages((prevMessages) =>
			prevMessages.filter((message) => message._id !== messageId)
		);
	};

	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredMessages(messages);
			setCurrentPage(1);
			return;
		}

		const filtered = messages.filter((message) =>
			message.content.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredMessages(filtered);
		setCurrentPage(1);
	}, [searchQuery, messages]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputQuery(value);
		debouncedSearch(value);
	};

	const paginatedMessages = () => {
		const startIndex = (currentPage - 1) * messagesPerPage;
		const endIndex = startIndex + messagesPerPage;
		return filteredMessages.slice(startIndex, endIndex);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (!session || !session.user) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-animate'>
				<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary)/0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(var(--secondary)/0.15),transparent_50%)] opacity-70 dark:opacity-40 animate-pulse-glow' />
				<Card className='w-full max-w-md p-6 bg-card/80 backdrop-blur-sm border-primary/10'>
					<h2 className='text-2xl font-bold text-center mb-4'>Access Denied</h2>
					<p className='text-center text-muted-foreground'>
						Please login to access your dashboard
					</p>
				</Card>
			</div>
		);
	}

	const { username } = session.user;
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
		<div className='min-h-screen bg-animate'>
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary)/0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(var(--secondary)/0.15),transparent_50%)] opacity-70 dark:opacity-40 animate-pulse-glow' />

			<main className='relative z-10'>
				<div className='container max-w-6xl mx-auto py-8 px-4 space-y-8'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-slide-up'>
						<div className='space-y-2'>
							<div className='inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2'>
								Dashboard
							</div>
							<h1 className='text-3xl font-bold tracking-tight text-gradient'>
								Message Center
							</h1>
							<p className='text-muted-foreground'>
								Manage your messages and profile settings
							</p>
						</div>
						<div className='flex items-center gap-4'>
							<div className='flex items-center gap-2 bg-card/80 backdrop-blur-sm p-3 rounded-lg border border-primary/10'>
								<Switch
									id='accept-messages'
									checked={acceptMessages}
									onCheckedChange={handleSwitchChange}
									disabled={isSwitchLoading}
								/>
								<label
									htmlFor='accept-messages'
									className='text-sm font-medium'
								>
									{acceptMessages ?
										'Accepting Messages'
									:	'Not Accepting Messages'}
								</label>
							</div>
						</div>
					</div>

					<Card className='overflow-hidden bg-card/80 backdrop-blur-sm border-primary/10 animate-slide-up delay-100'>
						<CardContent className='p-6'>
							<div className='flex flex-col sm:flex-row gap-4 items-center'>
								<div className='relative flex-1'>
									<Input
										value={profileUrl}
										readOnly
										className='pr-24 font-mono text-sm bg-background/50'
									/>
									<Button
										onClick={copyToClipboard}
										className='absolute right-1 top-1 h-7 hover-glow'
										size='sm'
									>
										<LinkIcon className='h-4 w-4 mr-1' />
										Copy
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className='flex items-center gap-4 animate-slide-up delay-200'>
						<div className='relative flex-1 max-w-sm'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search messages...'
								className='pl-9 bg-card/80 backdrop-blur-sm border-primary/10'
								value={inputQuery}
								onChange={handleInputChange}
							/>
						</div>
						<Button
							variant='outline'
							onClick={() => fetchMessages(true)}
							disabled={isLoading}
							className='border-primary/50 text-primary hover:bg-primary/5 hover-lift'
						>
							{isLoading ?
								<Loader2 className='h-4 w-4 animate-spin' />
							:	<RefreshCcw className='h-4 w-4' />}
							<span className='ml-2 hidden sm:inline'>Refresh</span>
						</Button>
					</div>

					<Tabs
						defaultValue='received'
						className='w-full animate-slide-up delay-300'
					>
						<TabsList className='grid w-full max-w-md grid-cols-2 bg-card/80 backdrop-blur-sm'>
							<TabsTrigger value='received'>Received</TabsTrigger>
							<TabsTrigger value='sent'>Sent</TabsTrigger>
						</TabsList>

						<TabsContent
							value='received'
							className='mt-6 space-y-4'
						>
							{paginatedMessages().length > 0 ?
								paginatedMessages().map((message, index) => (
									<Card
										key={message._id}
										className={`group hover:shadow-md transition-all duration-300 bg-card/80 backdrop-blur-sm border-primary/10 animate-slide-up delay-${(index + 4) * 100}`}
									>
										<CardContent className='p-4'>
											<div className='flex items-start justify-between gap-4'>
												<div className='flex-1 space-y-2'>
													<div className='flex items-center justify-between'>
														<p className='text-sm text-muted-foreground flex items-center'>
															<MessageCircle className='h-4 w-4 mr-2' />
															Anonymous •{' '}
															{message.createdAt ?
																formatDistanceToNowStrict(
																	new Date(message.createdAt),
																	{ addSuffix: true }
																)
															:	'Unknown'}
														</p>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive'
															onClick={() =>
																handleDeleteMessage(message._id as string)
															}
														>
															<Trash className='h-4 w-4' />
															<span className='sr-only'>Delete</span>
														</Button>
													</div>
													<p className='text-base leading-relaxed'>
														{message.content}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))
							:	<Card className='p-8 text-center bg-card/80 backdrop-blur-sm border-primary/10'>
									<div className='space-y-2'>
										<MessageCircle className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
										<p className='text-lg font-medium'>
											No messages to display
										</p>
										<p className='text-sm text-muted-foreground'>
											Messages you receive will appear here
										</p>
									</div>
								</Card>
							}

							{filteredMessages.length > messagesPerPage && (
								<Pagination className='mt-6'>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={() =>
													currentPage > 1 && handlePageChange(currentPage - 1)
												}
												className={
													currentPage === 1 ?
														'pointer-events-none opacity-50'
													:	'hover-lift'
												}
											/>
										</PaginationItem>
										{Array.from(
											{
												length: Math.ceil(
													filteredMessages.length / messagesPerPage
												),
											},
											(_, i) => (
												<PaginationItem key={i + 1}>
													<PaginationLink
														isActive={currentPage === i + 1}
														onClick={() => handlePageChange(i + 1)}
														className='hover-lift'
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
														Math.ceil(
															filteredMessages.length / messagesPerPage
														) && handlePageChange(currentPage + 1)
												}
												className={
													(
														currentPage >=
														Math.ceil(filteredMessages.length / messagesPerPage)
													) ?
														'pointer-events-none opacity-50'
													:	'hover-lift'
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							)}
						</TabsContent>

						<TabsContent
							value='sent'
							className='mt-6'
						>
							<Card className='p-8 text-center bg-card/80 backdrop-blur-sm border-primary/10'>
								<div className='space-y-2'>
									<MessageCircle className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
									<p className='text-lg font-medium'>
										No sent messages available
									</p>
									<p className='text-sm text-muted-foreground'>
										Messages you send will appear here
									</p>
								</div>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
