import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import UserModel from '@/app/model/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email and password are required');
                    }

                    await dbConnect();

                    const user = await UserModel.findOne({ email: credentials.email });
                    
                    if (!user) {
                        // Create new user
                        const hashedPassword = await bcrypt.hash(credentials.password, 10);
                        const newUser = await UserModel.create({
                            email: credentials.email,
                            password: hashedPassword,
                            isVerified: false,
                            isAcceptingMessages: true,
                            isNewUser: true,
                        });
                        return {
                            id: newUser._id.toString(),
                            email: newUser.email,
                            isVerified: false,
                            isAcceptingMessages: true,
                            username: newUser.username || '',
                            isNewUser: true,
                        };
                    }
                    
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        throw new Error('Invalid credentials');
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessages,
                        username: user.username,
                        isNewUser: user.isNewUser,
                    };
                } catch (error) {
                    console.error('Authorization error:', error);
                    return null;
                }
            }
        })
    ],
    
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
                token.isNewUser = user.isNewUser;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user._id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
                session.user.isNewUser = token.isNewUser;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    
    pages: {
        signIn: '/sign-in',
        signOut: '/signout',
        error: '/error',
        verifyRequest: '/verify-request',
        newUser: '/new-user'
    },

    session: {
        strategy: 'jwt',
    },
    
    secret: "travelbudd",
};