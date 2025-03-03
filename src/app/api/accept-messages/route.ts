// src/app/api/accept-messages/route.ts
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getServerSession, User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json(
			{
				success: false,
				message: 'You need to log in to update your message settings.',
			},
			{ status: 401 }
		);
	}

	const user = session.user as User;
	const { acceptMessages } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			user._id,
			{ isAcceptingMessages: acceptMessages },
			{ new: true }
		);

		if (!updatedUser) {
			return NextResponse.json(
				{ success: false, message: 'User not found. Please try again later.' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				message:
					acceptMessages ?
						'You can now receive messages from others.'
					:	'You have disabled message requests.',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating message status:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Something went wrong. Please try again later.',
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	await dbConnect();

	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json(
			{
				success: false,
				message: 'You need to log in to check your message settings.',
			},
			{ status: 401 }
		);
	}

	try {
		const user = await UserModel.findById((session.user as User)._id);
		if (!user) {
			return NextResponse.json(
				{ success: false, message: 'User not found. Please try again later.' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				message:
					user.isAcceptingMessages ?
						'You are currently accepting messages.'
					:	'You are not accepting messages right now.',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error fetching message status:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Something went wrong. Please try again later.',
			},
			{ status: 500 }
		);
	}
}
