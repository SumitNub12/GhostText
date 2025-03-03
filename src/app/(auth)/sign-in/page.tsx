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
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const Page = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setIsSubmitting(true);
		console.log(data.identifier + ' ' + data.password);

		const result = await signIn('credentials', {
			identifier: data.identifier,
			password: data.password,
			redirect: false,
		});

		if (result?.error) {
			console.log(result.error);
			toast.error('Incorrect username or password');
		} else if (result?.url) {
			toast.success('Logged in successfully');
			setIsSubmitting(false); // Reset state before redirecting
			router.replace('/dashboard');
		}

		setIsSubmitting(false);
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
				<div className='text-center '>
					<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
						Sign in to TrueFeedback
					</h1>

					<p className='mb-4'>Log in to continue your journey</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<FormField
							control={form.control}
							name='identifier'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email/Username</FormLabel>

									<FormControl>
										<Input
											placeholder='email/username'
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
							:	'Sign In'}
						</Button>
					</form>
				</Form>

				<div className='text-center mt-4'>
					<p>
						New member?{' '}
						<Link
							href='/sign-up'
							className='text-blue-600 hover:text-blue-800'
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
export default Page;
