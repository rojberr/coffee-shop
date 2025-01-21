import { CredentialsSignin, SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import Credentials from "@auth/core/providers/credentials";

class CustomError extends CredentialsSignin {
    code = "401"
}
   
export const authOptions: SvelteKitAuthConfig = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                console.log(`credentials: ${credentials.email} ${credentials.password}`);

                if (!credentials.email || !credentials.password) {
                    throw new Error('Email and password are required.');
                }

                // Custom logic: call your own API endpoint
                const baseUrl = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:5173";
                console.log("Base URL:", baseUrl);
                const response = await fetch(`${baseUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email_address: credentials.email,
                        password: credentials.password
                    }),
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new CustomError()
                }

                const user = await response.json();
                console.log(user);

                // Ensure `user` object contains required fields
                return {
                    id: user.id,
                    email: user.email,
                    isAdmin: user.isAdmin
                };
            },
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            // Attach user data to the JWT
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        session: async ({ session, token }) => {
            // Attach token data to the session
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    emailVerified: null,
                    isAdmin: token.isAdmin as number
                };
            }
            return session;
        }
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login", // Optional: Custom sign-in page
        error: '/login', // Strona obsługująca błędy logowania
    }
};

export const { signIn, signOut, handle } = SvelteKitAuth(authOptions);