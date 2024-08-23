"use server";

import { createClient } from "@/utils/supabase/server";
import { loginSchema, signupSchema, TLogin, TSignup } from "./types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
	TypeValidationError,
	EmailAlreadyExistsError,
	WrongLoginError,
	NotAuthenticatedError,
	UsernameAlreadyExistsError,
} from "@/app/customerrors";

export async function login(data: TLogin) {
	const supabase = createClient();

	const validatedLoginSchema = loginSchema.safeParse(data);
	if (!validatedLoginSchema.success) {
		console.error(validatedLoginSchema.error);
		const error = new TypeValidationError("Incorrect values on login.");
		return {
			name: error.name,
			message: error.message,
		};
	}

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		const error = new WrongLoginError("Incorrect email address or password.");
		return {
			name: error.name,
			message: error.message,
		};
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(data: TSignup) {
	const supabase = createClient();

	const validatedsignupSchema = signupSchema.safeParse(data);
	if (!validatedsignupSchema.success) {
		console.error(validatedsignupSchema.error);
		const error = new TypeValidationError("Incorrect values on signup.");
		return {
			name: error.name,
			message: error.message,
		};
	}

	const { count, error: uError } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.eq("username", validatedsignupSchema.data.username);
	if (uError) {
		console.error(uError);
		return {
			name: "Error",
			message: "Database connection error.",
		};
	} else if (count != null && count > 0) {
		const error = new UsernameAlreadyExistsError();
		return {
			name: error.name,
			message: error.message,
		};
	}

	const { error } = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
		options: {
			data: {
				username: data.username,
			},
		},
	});
	if (error) {
		console.error(error);
	}

	if (error?.code === "user_already_exists") {
		const error = new EmailAlreadyExistsError();
		return {
			name: error.name,
			message: error.message,
		};
	} else if (error) {
		return {
			name: "Error",
			message: "Unknown error.",
		};
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function getUserID(): Promise<string> {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		throw new NotAuthenticatedError("User not authenticated.");
	}

	return user?.id as string;
}
