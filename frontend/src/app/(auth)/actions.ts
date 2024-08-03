"use server";

import { createClient } from "@/utils/supabase/server";
import { loginSchema, signupSchema, TLogin, TSignup } from "./types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(data: TLogin) {
	const supabase = createClient();

	const validatedLoginSchema = loginSchema.safeParse(data);
	if (!validatedLoginSchema.success) {
		console.error(validatedLoginSchema.error);
		return { error: "Incorrect values." };
	}

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		return { error: "Incorrect email address or password." };
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(data: TSignup) {
	const supabase = createClient();

	const validatedsignupSchema = signupSchema.safeParse(data);
	if (!validatedsignupSchema.success) {
		console.error(validatedsignupSchema.error);
		return { error: "Incorrect values." };
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
		return { error: "Something went wrong." };
	}

	revalidatePath("/", "layout");
	redirect("/");
}
