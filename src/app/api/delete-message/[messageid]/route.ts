import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

type Params = Promise<{
	messageid: string;
}>;

export async function DELETE(
	req: NextRequest,
	segmentData: { params: Params }
) {
	const params = await segmentData.params;
	const messageId = params.messageid;
	await dbConnect();
	const session = await getServerSession(authOptions);
	const _user: User = session?.user as User;
	if (!session || !_user) {
		return Response.json(
			{ success: false, message: 'Not authenticated' },
			{ status: 401 }
		);
	}

	try {
		const updateResult = await UserModel.updateOne(
			{ _id: _user._id },
			{ $pull: { messages: { _id: messageId } } }
		);

		if (updateResult.modifiedCount === 0) {
			return Response.json(
				{ message: 'Message not found or already deleted', success: false },
				{ status: 404 }
			);
		}

		return Response.json(
			{ message: 'Message deleted', success: true },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting message:', error);
		return Response.json(
			{ message: 'Error deleting message', success: false },
			{ status: 500 }
		);
	}
}
