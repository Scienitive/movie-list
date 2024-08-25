"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NotAuthenticatedError, DatabaseError } from "@/app/customerrors";
import { headers } from "next/headers";

export async function OAuthLogin(
	provider: "google" | "twitter" | "github" | "discord" | "spotify",
): Promise<void> {
	const supabase = createClient();
	const origin = headers().get("origin");

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	});
	if (error) {
		throw new DatabaseError("Error while oAuth login.");
	}

	console.log(data.url);
	redirect(data.url);
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
