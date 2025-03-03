import {
	Button,
	Container,
	Font,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Row,
	Section,
	Text,
} from '@react-email/components';

interface VerificationEmailProps {
	username: string;
	otp: string;
}

export default function VerificationEmail({
	username,
	otp,
}: VerificationEmailProps) {
	return (
		<Html
			lang='en'
			dir='ltr'
		>
			<Head>
				<title>Verification Code</title>
				<Font
					fontFamily='Roboto'
					fallbackFontFamily='Verdana'
					webFont={{
						url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle='normal'
				/>
			</Head>
			<Preview>Here's your verification code: {otp}</Preview>

			<Container style={styles.container}>
				<Section>
					<Row>
						<Heading
							as='h2'
							style={styles.heading}
						>
							Hello {username},
						</Heading>
					</Row>
					<Row>
						<Text style={styles.text}>
							Thank you for registering. Please use the following verification
							code to complete your registration:
						</Text>
					</Row>
					<Row>
						<Text style={styles.otp}>{otp}</Text>
					</Row>
					<Row>
						<Text style={styles.text}>
							If you did not request this code, please ignore this email. For
							your security, do not share this code with anyone.
						</Text>
					</Row>
					<Row>
						<Button
							href={`http://localhost:3000/verify/${username}`}
							style={styles.button}
						>
							Verify Here
						</Button>
					</Row>
				</Section>

				<Section style={styles.footer}>
					<Row>
						<Text style={styles.footerText}>
							If you have any questions, please contact us at{' '}
							<Link
								href='mailto:support@example.com'
								style={styles.link}
							>
								support@example.com
							</Link>
							.
						</Text>
					</Row>
					<Row>
						<Text style={styles.footerText}>
							&copy; {new Date().getFullYear()} True-FeedBack. All rights
							reserved.
						</Text>
					</Row>
				</Section>
			</Container>
		</Html>
	);
}

// Inline Styles for Better Email Compatibility
const styles = {
	container: {
		maxWidth: '600px',
		margin: '0 auto',
		padding: '20px',
		backgroundColor: '#ffffff',
		borderRadius: '8px',
		boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
		textAlign: 'center' as const,
	},
	heading: {
		color: '#333333',
	},
	text: {
		color: '#666666',
		fontSize: '14px',
	},
	otp: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		color: '#007bff',
		margin: '10px 0',
	},
	button: {
		display: 'inline-block',
		padding: '10px 20px',
		backgroundColor: '#007bff',
		color: '#ffffff',
		textDecoration: 'none',
		borderRadius: '5px',
		marginTop: '15px',
	},
	footer: {
		marginTop: '20px',
		textAlign: 'center' as const,
	},
	footerText: {
		color: '#999999',
		fontSize: '12px',
	},
	link: {
		color: '#007bff',
		textDecoration: 'none',
	},
};
