import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				identifier: { label: 'Email or Username', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials): Promise<any> {
				if (!credentials?.identifier || !credentials?.password) {
					throw new Error('Email/Username and password are required');
				}

				await dbConnect();

				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});

					if (!user) {
						throw new Error('No user found with this email or username');
					}

					if (!user.isVerified) {
						throw new Error('Please verify your account before logging in');
					}

					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordCorrect) {
						throw new Error('Incorrect password');
					}

					return {
						_id: user._id!.toString(),
						email: user.email,
						username: user.username,
						isVerified: user.isVerified,
						isAcceptingMessages: user.isAcceptingMessages,
					};
				} catch (err: any) {
					throw new Error(err.message || 'Authentication failed');
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id;
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			}
			console.log(token);
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (token) {
				session.user = {
					_id: token._id,
					isVerified: token.isVerified,
					isAcceptingMessages: token.isAcceptingMessages,
					username: token.username,
				};
			}
			return session;
		},
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/sign-in',
	},
};
