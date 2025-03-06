import { createGoogleGenerativeAI, GoogleErrorData } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function POST() {
	try {
		console.log('Starting AI suggestion generation...');

		const prompt = `
			Generate exactly three unique and engaging questions for an anonymous social messaging platform.
			Each question **must** be separated by '||' **with no extra line breaks or spaces**.
			Ensure that every response is different from previous ones and is creative.
			Strictly follow this format:
			Question 1 || Question 2 || Question 3

			Examples:  
			1. "If you could master any skill instantly, what would it be? || What's the best advice you've ever received? || What’s your dream travel destination?"  
			2. "What's a fun fact about you that most people don’t know? || If you could have a superpower for a day, what would it be? || What’s your go-to comfort food?"

			Generate fresh, diverse, and engaging questions every time. Do NOT repeat past examples.
		`;

		console.log('Sending request to Gemini AI...');
		const model = google('gemini-2.0-flash-001');

		// Generate text using Gemini AI with randomness (temperature)
		const { text } = await generateText({
			model,
			system:
				'You are an AI assistant generating fresh and random, engaging social conversation starters.',
			prompt,
			temperature: 0.9, // Increase randomness for diverse responses
		});

		console.log('AI Response:', text);

		// Returning response to client
		return NextResponse.json({ questions: text });
	} catch (error) {
		const err = error as GoogleErrorData;
		console.error('AI Request Failed:', error);
		return NextResponse.json(
			{ error: 'Failed to generate suggestions', details: err.error.message },
			{ status: 500 }
		);
	}
}
