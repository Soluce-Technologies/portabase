import NextAuth, {CredentialsSignin} from "next-auth";
import {prisma} from "@/prisma";
import {PrismaAdapter} from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import {env} from "@/env.mjs";
import GoogleProvider from "next-auth/providers/google";

class InvalidLoginError extends CredentialsSignin {
    code = "Invalid identifier or password"
}

export const {handlers, auth: baseAuth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    theme: {
        logo: "/logo.png"
    },
    secret: env.NEXT_PUBLIC_SECRET,
    debug: process.env.NODE_ENV !== "production",
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            authorize: async (credentials) => {
                let user = null
                const argon2 = require('argon2');
                console.log(credentials);
                user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email,
                    }
                })
                if (!user) {
                    return null
                }
                const isValid = await argon2.verify(user.password, credentials.password)
                if (!isValid) {
                    return null
                }
                return user;
            },
        }),
        GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
            profile(profile) {
                return {
                    // role: profile.email === "soluce.technologies@gmail.com" ? "admin" : "user",
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    authMethod: "google",
                }
            },
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/error"
    },
    callbacks: {
        session({session, user, token}) {
            // session.user.role = user.role
            // session.user.authMethod = user.authMethod;
            return session
        },
        async signIn({ account, user }) {
            console.log(account)
            // const authMethod = account.provider === 'credentials' ? 'credentials' : 'oauth';
            user = await prisma.user.findFirst({
                where: {
                    email: user.email,
                }
            })
            if (!user) {
                return true
            }
            console.log(user)
            // Update the user in the database with the auth method
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    authMethod: account.provider
                },
            });

            return true;
        },
    },

});

