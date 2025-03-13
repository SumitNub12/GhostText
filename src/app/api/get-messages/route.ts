import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';

export async function GET() {
	await dbConnect();

	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return new Response(
			JSON.stringify({ success: false, message: 'Not authenticated' }),
			{ status: 401 }
		);
	}

	try {
		const userId = new mongoose.Types.ObjectId(session.user._id); // Make sure _id is present

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

		if (result.length === 0) {
			return new Response(
				JSON.stringify({ success: false, message: 'No messages found' }),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({ success: true, messages: result[0].messages }),
			{ status: 200 }
		);
	} catch (error) {
		console.error('Failed to fetch messages', error);
		return new Response(
			JSON.stringify({ success: false, message: 'Failed to fetch messages' }),
			{ status: 500 }
		);
	}
}
