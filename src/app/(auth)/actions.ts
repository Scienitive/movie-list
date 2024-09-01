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

	console.log("%%%%%");
	console.log(origin);

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	});
	if (error) {
		throw new DatabaseError("Error while oAuth login.");
	}

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

export async function doesUserExist(username: string): Promise<boolean> {
	const supabase = createClient();

	const { count, error } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.eq("username", username);
	if (error) {
		throw new DatabaseError(error.message);
	}

	return count === 0 ? false : true;
}

export async function getProfileData(username: string) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("profiles")
		.select("id")
		.eq("username", username)
		.single();
	if (error) {
		throw new DatabaseError(error.message);
	}

	const userID = data.id;

	const { count: totalListCount, error: error2 } = await supabase
		.from("lists")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userID);
	if (error2) {
		throw new DatabaseError(error2.message);
	}

	const { count: totalLikeCount, error: error3 } = await supabase
		.from("likes")
		.select("lists!inner(user_id)", { count: "exact", head: true })
		.eq("lists.user_id", userID);
	if (error3) {
		throw new DatabaseError(error3.message);
	}

	return { totalListCount, totalLikeCount };
}
