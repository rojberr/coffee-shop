import { DefaultSession, DefaultUser } from '@auth/core/types';

declare module '@auth/core/types' {
    interface User extends DefaultUser {
        isAdmin?: number;
    }

    interface Session {
        user?: {
            id?: string;
            email?: string;
            isAdmin?: number;
        };
    }

    interface JWT {
        id?: string;
        email?: string;
        isAdmin?: number;
    }
}