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
			identifier: 'sumit',
			password: 'test1234',
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		const isValid = form.trigger();
		if (!isValid) return;
		setIsSubmitting(true);

		try {
			const result = await signIn('credentials', {
				identifier: data.identifier,
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				toast.error('Incorrect username or password');
				setIsSubmitting(false);
			} else if (result?.url) {
				toast.success('Logged in successfully');
				router.replace('/dashboard');
			}
		} catch (error) {
			toast.error('An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-background'>
			<div className='w-full max-w-md p-8 bg-card rounded-lg shadow-md border-1 border-border'>
				<div className='text-center'>
					<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-foreground'>
						Welcome back to GhostText
					</h1>

					<p className='mb-4 text-muted-foreground'>
						Log in to continue your journey
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-6'
						noValidate
					>
						<FormField
							control={form.control}
							name='identifier'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-foreground'>
										Email/Username
									</FormLabel>
									<FormControl>
										<Input
											placeholder='email/username'
											{...field}
											className='focus:border-primary focus:ring-primary'
										/>
									</FormControl>
									<FormMessage className='text-destructive text-sm mt-1' />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-foreground'>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='enter password'
											{...field}
											className='focus:border-primary focus:ring-primary'
										/>
									</FormControl>
									<FormMessage className='text-destructive text-sm mt-1' />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							disabled={isSubmitting}
							className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
						>
							{isSubmitting ?
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Please wait
								</>
							:	'Sign In'}
						</Button>
					</form>
				</Form>

				<div className='text-center mt-4'>
					<p className='text-muted-foreground'>
						New member?{' '}
						<Link
							href='/sign-up'
							className='text-primary hover:text-primary/80'
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
