// import {PrismaAdapter} from "@auth/prisma-adapter";
// import NextAuth from "next-auth";
// import {prisma} from "@/prisma";
// import Credentials from "next-auth/providers/credentials";
//
//
// export const {handlers, auth: baseAuth, signIn, signOut} = NextAuth({
//     adapter: PrismaAdapter(prisma),
//     theme: {
//         logo: "/icon.png"
//     },
//     pages: {
//         signIn: "/login",
//     },
//     debug: process.env.NODE_ENV !== "production",
//     providers: [
//         Credentials({
//             credentials: { password: { label: "Password", type: "password" } },
//             authorize(c) {
//                 if (c.password !== "password") return null
//                 return {
//                     id: "test",
//                     name: "Test User",
//                     email: "test@example.com",
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         session({ session, user, token }) {
//             session.user.role = user.role
//
//             return session
//         }
//     },
//     events: {
//         createUser: async (message) => {
//             const userId = message.user.id
//             const userEmail = message.user.email
//
//             if (!userId || !userEmail) {
//                 return;
//             }
//
//             // const stripeCustomer = await stripe.customers.create({
//             //     name: message.user.name ?? "",
//             //     email: userEmail,
//             // })
//             //
//             // await prisma.user.update({
//             //     where: {
//             //         id: userId,
//             //     },
//             //     data: {
//             //         stripeCustomerId: stripeCustomer.id,
//             //     }
//             // })
//         }
//     }
//
//
// });
//
// export const providerMap = providers
//     .map((provider) => {
//         if (typeof provider === "function") {
//             const providerData = provider()
//             return { id: providerData.id, name: providerData.name }
//         } else {
//             return { id: provider.id, name: provider.name }
//         }
//     })
//     .filter((provider) => provider.id !== "credentials")

import NextAuth from "next-auth";
import {prisma} from "@/prisma";
import {PrismaAdapter} from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import {env} from "@/env.mjs";


export const {handlers, auth: baseAuth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    theme: {
        logo: "/icon.png"
    },
    secret: env.NEXT_PUBLIC_SECRET,
    debug: process.env.NODE_ENV !== "production",
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null
                console.log(credentials);
                // // logic to salt and hash password
                // const pwHash = saltAndHashPassword(credentials.password)
                //
                // // logic to verify if the user exists
                // user = await getUserFromDb(credentials.email, pwHash)
                //
                // if (!user) {
                //     // No user found, so this is their first attempt to login
                //     // Optionally, this is also the place you could do a user registration
                //     throw new Error("Invalid credentials.")
                // }
                //
                // // return user object with their profile data
                return user
            },
            // credentials: { password: { label: "Password", type: "password" } },
            // authorize(c) {
            //     if (c.password !== "password") return null
            //     console.log(c)
            //     return {
            //         id: "test",
            //         name: "Test User",
            //         email: "test@example.com",
            //     }
            // },
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session({ session, user, token }) {
            session.user.role = user.role
            return session
        }
    },

});
