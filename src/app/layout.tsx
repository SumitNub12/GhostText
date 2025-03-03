import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/context/AuthProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
	title: 'True Feedback',
	description: 'Real feedback from real people.',
};

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider>
					<Navbar />
					{children}
					<Toaster
						richColors={true}
						position='bottom-center'
						closeButton={true}
					/>
				</AuthProvider>
			</body>
		</html>
	);
}
