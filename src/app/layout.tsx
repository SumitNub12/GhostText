import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/context/AuthProvider';
import type { Metadata } from 'next';
// import { Fira_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
	title: 'Whisper',
	description: 'Real feedback from real people.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<AuthProvider>
				<ThemeProvider>
					<body className={` ${inter.className} theme-purple antialiased`}>
						<Navbar />
						{children}
						<Toaster
							richColors={true}
							position='bottom-center'
							closeButton={true}
						/>
					</body>
				</ThemeProvider>
			</AuthProvider>
		</html>
	);
}
