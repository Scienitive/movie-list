"use server";

import { createClient } from "@/utils/supabase/server";
import { movieInfoSchema, TAction, TMovieInfo } from "./types";
import { getUserId } from "../(auth)/actions";
import { revalidatePath } from "next/cache";

export async function getMovieData(movieIds: number[]): Promise<TAction> {
	const apiToken = process.env.TMDB_API_TOKEN;
	const apiURL = "https://api.themoviedb.org/3/movie";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${apiToken}`,
		},
	};

	const movieData: TMovieInfo[] = [];
	const requests: Promise<Response>[] = [];
	movieIds.forEach((id) => {
		const req = fetch(`${apiURL}/${id.toString()}`, options);
		requests.push(req);
	});

	const res = await Promise.all(requests);
	const jsonDatas = await Promise.all(
		res.filter((r) => r.status === 200).map((r) => r.json()),
	);
	jsonDatas.forEach((jsonData) => {
		const trimmedData: TMovieInfo = {
			title: jsonData.title,
			releaseYear: jsonData.release_date.split("-")[0],
			posterPath: jsonData.poster_path,
			imdbURL: `https://www.imdb.com/title/${jsonData.imdb_id}`,
			tmdbURL: `https://www.themoviedb.org/movie/${jsonData.id}`,
		};
		const validated = movieInfoSchema.safeParse(trimmedData);
		if (!validated.success) {
			console.error(validated.error);
			return { error: "TMDB API error." };
		}

		movieData.push(validated.data);
	});

	return { data: movieData };
}

export async function getLikeCount(listId: number): Promise<TAction> {
	const supabase = createClient();

	const { count, error } = await supabase
		.from("likes")
		.select("*", { count: "exact", head: true })
		.eq("list_id", listId);

	if (error) {
		console.error(error);
		return { error: error.message };
	}

	return { data: count };
}

export async function insertLike(postId: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("likes")
		.insert([{ user_id: await getUserId(), list_id: postId }])
		.select();

	if (error) {
		console.error(error);
	}
}

export async function deleteLike(postId: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("likes")
		.delete()
		.eq("user_id", await getUserId())
		.eq("list_id", postId);

	if (error) {
		console.error(error);
	}
}

export async function isUserLikedPost(postId: number): Promise<boolean> {
	const supabase = createClient();

	const userId = await getUserId();

	let { count } = await supabase
		.from("likes")
		.select("*", { count: "exact", head: true })
		.eq("list_id", postId)
		.eq("user_id", userId);

	if (count && count > 0) {
		return true;
	} else {
		return false;
	}
}

export async function getUsername(): Promise<string | undefined> {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user?.user_metadata.username;
}

export async function deleteList(listId: number) {
	const supabase = createClient();

	const { error } = await supabase.from("lists").delete().eq("id", listId);
	// TODO handle the error

	revalidatePath("/", "layout");
}
