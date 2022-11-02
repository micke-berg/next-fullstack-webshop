import NextAuth from 'next-auth';
import { CredentialsProvider } from 'next-auth/providers';
import User from '../../../models/Users';
import db from '../../../utils/db';
import bcryptjs from 'bcryptjs';

export default NextAuth({
	session: {
		stategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user?.id) token._id = user._id;
			if (user?.isAdmin) token._isAdmin = user.isAdmin;
			return token;
		},
		async session({ session, token }) {
			if (token?.id) session.user._id = token._id;
			if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
		},
	},
	providers: [
		CredentialsProvider({
			async autorize(credentials) {
				await db.connect();
				const user = await User.findOne({
					email: credentials.email,
				});
				await db.disconect();
				if (user && bcryptjs.compareSync(credentials.password, user.password)) {
					return {
						_id: user._id,
						name: user.name,
						email: user.email,
						image: 'f',
						isAdmin: user.isAdmin,
					};
				}
				throw new Error('Invalid email or password');
			},
		}),
	],
});
