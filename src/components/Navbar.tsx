'use client';
import ThemeToggle from '@/components/ThemeToggle';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, Menu, MessageCircle, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
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
		<header className='sticky top-0 z-50 w-full border-b border-primary/10 bg-background/60 backdrop-blur-lg overflow-hidden'>
			<div className='w-full max-w-screen-xl mx-auto flex h-16 items-center px-4 md:px-10'>
				{/* Logo */}
				<div className='mr-4 flex flex-1'>
					<Link
						href='/'
						className='flex items-center space-x-2 group hover-lift'
					>
						<div className='relative'>
							<div className='absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
							<MessageCircle className='h-6 w-6 text-primary relative' />
						</div>
						<span className='font-bold text-primary'>Whisper</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className='hidden md:flex items-center space-x-4'>
					<nav className='flex items-center space-x-4'>
						{session ?
							<>
								<span className='text-muted-foreground truncate max-w-[150px]'>
									Welcome, {user.username || user.email}
								</span>
								<Link href='/dashboard'>
									<Button
										variant='ghost'
										size='sm'
										className='hover:bg-primary/10 hover:text-primary hover-lift'
									>
										<MessageCircle className='mr-2 h-4 w-4' />
										Messages
									</Button>
								</Link>
								<Button
									onClick={handleSignOut}
									size='sm'
									variant='outline'
									className='border-primary/50 text-destructive-foreground bg-destructive hover:bg-destructive/10 hover-lift'
								>
									Logout
								</Button>
							</>
						:	<Link href='/sign-in'>
								<Button
									size='sm'
									className='hover-glow btn-pulse'
								>
									<LogIn className='mr-2 h-4 w-4' />
									Login
								</Button>
							</Link>
						}
						<div className='hover-lift'>
							<ThemeToggle />
						</div>
					</nav>
				</div>

				{/* Mobile Navigation */}
				<div className='md:hidden flex items-center space-x-2'>
					<div className='hover-lift'>
						<ThemeToggle />
					</div>
					<DropdownMenu
						open={isMenuOpen}
						onOpenChange={setIsMenuOpen}
					>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								onClick={toggleMenu}
								className='hover:bg-primary/10 hover:text-primary hover-lift'
							>
								{isMenuOpen ?
									<X className='h-6 w-6' />
								:	<Menu className='h-6 w-6' />}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='w-[220px] bg-card/80 backdrop-blur-md border-primary/10 animate-slide-up overflow-hidden'
						>
							{session ?
								<>
									<DropdownMenuItem className='text-muted-foreground cursor-default truncate'>
										Welcome, {user.username || user.email}
									</DropdownMenuItem>
									<Link href='/dashboard'>
										<DropdownMenuItem
											onSelect={() => setIsMenuOpen(false)}
											className='hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary'
										>
											<MessageCircle className='mr-2 h-4 w-4' />
											Messages
										</DropdownMenuItem>
									</Link>
									<DropdownMenuItem
										onSelect={handleSignOut}
										className='text-destructive-foreground focus:bg-destructive bg-destructive'
									>
										Logout
									</DropdownMenuItem>
								</>
							:	<Link href='/sign-in'>
									<DropdownMenuItem
										onSelect={() => setIsMenuOpen(false)}
										className='hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary'
									>
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
