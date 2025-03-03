import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{ success: false, message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const userId = user._id;

	const { acceptMessages } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingMessages: acceptMessages },
			{ new: true }
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: 'Failed  to update user status to accept messages',
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				message: 'User status updated to accept messages',
				updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Failed to update user status to accept messages', error);

		return Response.json(
			{
				success: false,
				message: 'Failed to update user status to update messages',
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{ success: false, message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const userId = user._id;

	try {
		const user = await UserModel.findById(userId);
		if (!user) {
			return Response.json(
				{ success: false, message: 'User not found' },
				{ status: 404 }
			);
		} else {
			return Response.json(
				{ success: true, isAcceptingMessages: user.isAcceptingMessages },
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error('Failed to get user status to accept messages', error);

		return Response.json(
			{
				success: false,
				message: 'Failed to get user status to accept messages',
			},
			{ status: 500 }
		);
	}
}
