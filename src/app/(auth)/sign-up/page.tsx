'use client';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';

const Page = () => {
	const [username, setUsername] = useState('');
	const [usernameMessage, setUsernameMessage] = useState('');

	const [isCheckingUsername, setIsCheckingUsername] = useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const debounced = useDebounceCallback(setUsername, 500);

	const router = useRouter();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		const checkUsername = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage('');

				try {
					const response = await axios.get(
						`/api/check-username-unique?username=${username}`
					);

					const message = response.data.message;
					setUsernameMessage(message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;

					setUsernameMessage(
						axiosError.response?.data.message ?? 'Error checking username'
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};

		checkUsername();
	}, [username, debounced]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmitting(true);

		try {
			const response = await axios.post<ApiResponse>('/api/sign-up', data);

			toast.success(response.data.message);

			router.replace(`/verify/${username}`);
			setIsSubmitting(false);
		} catch (error) {
			console.error('Error in sign up of user', error);

			const axiosError = error as AxiosError<ApiResponse>;

			const errorMsg = axiosError.response?.data.message ?? 'Error signing up';

			toast.error(errorMsg);

			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
				<div className='text-center '>
					<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
						Join TrueFeedback
					</h1>

					<p className='mb-4'>Sign up to start your anonymous adventure </p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>

									<FormControl>
										<div className='relative'>
											<Input
												placeholder='username'
												{...field}
												className='pr-10' // Add right padding to prevent text overlap
												onChange={(e) => {
													field.onChange(e);
													debounced(e.target.value);
												}}
											/>
											{isCheckingUsername && (
												<Loader className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 animate-spin' />
											)}
										</div>
									</FormControl>

									<p
										className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-600' : 'text-red-600'}`}
									>
										{username.charAt(0).toUpperCase() + username.slice(1) + ' '}
										{username ? usernameMessage : ''}
									</p>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>

									<FormControl>
										<Input
											placeholder='email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>

									<FormControl>
										<Input
											type='password'
											placeholder='enter password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							disabled={isSubmitting}
							className='w-full'
						>
							{isSubmitting ?
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin text-white' />
									Please wait
								</>
							:	'Sign - Up'}
						</Button>
					</form>
				</Form>

				<div className='text-center mt-4'>
					<p>
						Already a member ?
						<Link
							href='/sign-in'
							className='text-blue-600 hover:text-blue-800'
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
export default Page;
