"use server";

import { loginSchema, signupSchema, TLogin, TSignup } from "./types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { pb, setAuthCookie } from "@/utils/pocketbase/client";
import to from "await-to-js";

export async function login(data: TLogin) {
	const validatedLoginSchema = loginSchema.safeParse(data);
	if (!validatedLoginSchema.success) {
		console.error(validatedLoginSchema.error);
		return { error: "Incorrect values." };
	}

	const [error, authData] = await to(
		pb
			.collection("users")
			.authWithPassword(
				validatedLoginSchema.data.email,
				validatedLoginSchema.data.password,
			),
	);
	setAuthCookie(pb);

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(data: TSignup) {
	const validatedsignupSchema = signupSchema.safeParse(data);
	if (!validatedsignupSchema.success) {
		console.error(validatedsignupSchema.error);
		return { error: "Incorrect values." };
	}

	const [error, authData] = await to(
		pb.collection("users").create({
			username: validatedsignupSchema.data.username,
			email: validatedsignupSchema.data.email,
			emailVisibility: true,
			password: validatedsignupSchema.data.password,
			passwordConfirm: validatedsignupSchema.data.password,
		}),
	);

	revalidatePath("/", "layout");
	redirect("/");
}

export async function getUserID(): Promise<string> {
	if (!pb.authStore.isValid) {
		throw new NotAuthenticatedError("User not authenticated.");
	}
}
