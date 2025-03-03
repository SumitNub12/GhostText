import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/context/AuthProvider';
import type { Metadata } from 'next';
import { Fira_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
	title: 'True Feedback',
	description: 'Real feedback from real people.',
};

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta-sans',
	subsets: ['latin'],
	display: 'swap',
});

const firaMono = Fira_Mono({
	variable: '--font-fira-mono',
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '700'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<AuthProvider>
				<body
					className={`${plusJakartaSans.variable} ${firaMono.variable} antialiased`}
				>
					{/* <Navbar /> */}
					{children}
					<Toaster
						richColors={true}
						position='bottom-center'
						closeButton={true}
					/>
				</body>
			</AuthProvider>
		</html>
	);
}
