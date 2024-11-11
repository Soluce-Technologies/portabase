// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            authMethod: string; // Add authMethod to the session user type
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        authMethod: string; // Add authMethod to the user type
    }
}