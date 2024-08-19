import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});
export type TLogin = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
	username: z
		.string()
		.regex(/^[a-zA-Z0-9_]+$/)
		.max(12),
	email: z.string().email(),
	password: z.string().min(6),
});
export type TSignup = z.infer<typeof signupSchema>;
