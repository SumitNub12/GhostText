'use client';
import ThemeToggle from '@/components/ThemeToggle';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, Menu, MessageCircle, User, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeScript } from './theme-script';
import { Button } from './ui/button';

function Navbar() {
	const { data: session } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const user = session?.user as { username?: string; email?: string };

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleSignOut = () => {
		signOut();
		setIsMenuOpen(false);
	};

	return (
		<header
			className='sticky top-0 z-50 w-full border-b border-border bg-background/95 
      backdrop-blur supports-[backdrop-filter]:bg-background/60'
		>
			<ThemeScript />
			<div className='w-full max-w-screen-xl mx-auto flex h-16 items-center px-4 md:px-10'>
				{/* Logo */}
				<div className='mr-4 flex flex-1'>
					<Link
						href='/'
						className='flex items-center space-x-2'
					>
						<MessageCircle className='h-6 w-6 text-primary' />
						<span className='font-bold text-foreground'>Whisper</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className='hidden md:flex items-center space-x-4'>
					<nav className='flex items-center space-x-2'>
						{session ?
							<>
								<span className='mr-4 text-muted-foreground'>
									Welcome, {user.username || user.email}
								</span>
								<Link href='/dashboard'>
									<Button
										variant='ghost'
										size='sm'
										className='hover:bg-accent hover:text-accent-foreground'
									>
										<MessageCircle className='mr-2 h-4 w-4' />
										Messages
									</Button>
								</Link>
								<Button
									onClick={handleSignOut}
									size='sm'
									className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
								>
									Logout
								</Button>
							</>
						:	<Link href='/sign-in'>
								<Button
									size='sm'
									className='bg-primary text-primary-foreground hover:bg-primary/90'
								>
									<LogIn className='mr-2 h-4 w-4' />
									Login
								</Button>
							</Link>
						}
						<ThemeToggle />
					</nav>
				</div>

				{/* Mobile Navigation */}
				<div className='md:hidden flex items-center space-x-2'>
					<ThemeToggle />
					<DropdownMenu
						open={isMenuOpen}
						onOpenChange={setIsMenuOpen}
					>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								onClick={toggleMenu}
							>
								{isMenuOpen ?
									<X className='h-6 w-6' />
								:	<Menu className='h-6 w-6' />}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='w-56'
						>
							{session ?
								<>
									<DropdownMenuItem className='text-muted-foreground cursor-default'>
										Welcome, {user.username || user.email}
									</DropdownMenuItem>
									<Link href='/dashboard'>
										<DropdownMenuItem onSelect={() => setIsMenuOpen(false)}>
											<MessageCircle className='mr-2 h-4 w-4' />
											Messages
										</DropdownMenuItem>
									</Link>
									<Link href='/profile'>
										<DropdownMenuItem onSelect={() => setIsMenuOpen(false)}>
											<User className='mr-2 h-4 w-4' />
											Profile
										</DropdownMenuItem>
									</Link>
									<DropdownMenuItem
										onSelect={handleSignOut}
										className='text-destructive focus:bg-destructive/10'
									>
										Logout
									</DropdownMenuItem>
								</>
							:	<Link href='/sign-in'>
									<DropdownMenuItem onSelect={() => setIsMenuOpen(false)}>
										<LogIn className='mr-2 h-4 w-4' />
										Login
									</DropdownMenuItem>
								</Link>
							}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}

export default Navbar;
