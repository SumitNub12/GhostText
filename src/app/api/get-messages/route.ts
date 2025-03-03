import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

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

	const userId = new mongoose.Types.ObjectId(user._id);

	try {
		const result = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: '$messages' },
			{ $sort: { 'messages.createdAt': -1 } },
			{
				$group: {
					_id: '$_id',
					messages: { $push: '$messages' },
				},
			},
		]);

		if (!user || result.length === 0) {
			return Response.json(
				{ success: false, message: 'No messages found' },
				{ status: 404 }
			);
		}

		return Response.json({ success: true, messages: result[0].messages });
    } catch (error) {
        console.error('Failed to fetch messages', error);
		return Response.json(
			{ success: false, message: 'Failed to fetch messages', error },
			{ status: 500 }
		);
	}
}
