import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { getCollection } from '@/lib/mongodb';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const usersCollection = await getCollection('users');
          const user = await usersCollection.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            nid: user.nid,
            contact: user.contact,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.nid = user.nid;
        token.contact = user.contact;
      }
      if (account?.provider === 'google') {
        // Save Google user to database if first login
        try {
          const usersCollection = await getCollection('users');
          const existingUser = await usersCollection.findOne({ email: token.email });
          
          if (!existingUser) {
            const result = await usersCollection.insertOne({
              email: token.email,
              name: token.name,
              image: token.picture,
              provider: 'google',
              createdAt: new Date(),
            });
            token.id = result.insertedId.toString();
          } else {
            token.id = existingUser._id.toString();
          }
        } catch (error) {
          console.error('Error saving Google user:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.nid = token.nid;
        session.user.contact = token.contact;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
