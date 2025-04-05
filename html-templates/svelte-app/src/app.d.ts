// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Database;
			user?: {
				id: string;
				email: string;
				isAdmin: boolean;
				tokenExpired: boolean;
			  };
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
