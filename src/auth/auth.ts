import NextAuth, {CredentialsSignin} from "next-auth";
import {prisma} from "@/prisma";
import {PrismaAdapter} from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import {env} from "@/env.mjs";
import GoogleProvider from "next-auth/providers/google";



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
                if (!user || user.role === "pending") {
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
            async profile(profile) {

                const users = await prisma.user.findMany({
                    where: {
                        deleted: {not: true},
                    }
                })
                console.log(users.length)
                const role = users.length > 0 ? "pending" : "admin"


                return {
                    role: role,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    email_verified: profile.email_verified,
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
        // session({session, user, token}) {
        //     // session.user.role = user.role
        //     // session.user.authMethod = user.authMethod;
        //     return session
        // },
        async jwt({ token, trigger, session, user }) {
            if (trigger === "update" && session) {
                return { ...token, ...session?.user };
            }

            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
        async signIn({ account, user, profile }) {
            const existingUser = await prisma.user.findFirst({
                where: { email: user.email },
            });

            if (!existingUser) {
                // Create a new user with a pending role


                const users = await prisma.user.findMany({
                    where: {
                        deleted: {not: true},
                    }
                })
                const role = users.length > 0 ? "pending" : "admin"

                await prisma.user.create({
                    data: {
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: role,
                        authMethod: account.provider,
                    },
                });
                return role !== "pending";

            }

            if (existingUser.role === "pending") {
                return false; // Prevent login if role is pending
            }

            // Update auth method if user exists
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    authMethod: account.provider,
                },
            });

            return true; // Allow login
        },
    }

});

