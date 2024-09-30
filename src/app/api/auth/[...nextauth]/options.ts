import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import UserModel from '@/app/model/User';

declare module 'next-auth' {
    interface Session {
        user: {
            _id: string;
            isVerified: boolean;
            isAcceptingMessages: boolean;
            username: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        isVerified: boolean;
        isAcceptingMessages: boolean;
        username: string;
    }
}

interface Credentials {
    email: string;
    password: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Credentials): Promise<any> {
                await dbConnect();

                const user = await UserModel.findOne({ email: credentials.email });
                if (!user) {
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    const newUser = await UserModel.create({
                        email: credentials.email,
                        password: hashedPassword,
                        isVerified: false,
                    });
                    return newUser;

                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) throw new Error('Invalid email or password');

                return user;
            }
        })
    ],
    
    callbacks: {
        
        async session({ session, token }) {
            if (session.user) {
                session.user._id = token.id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
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
    
    secret: process.env.NEXTAUTH_SECRET || 'secret',
};
