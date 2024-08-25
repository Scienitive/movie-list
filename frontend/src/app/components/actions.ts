"use server";

import { createClient } from "@/utils/supabase/server";
import { movieInfoSchema, TMovieInfo } from "./types";
import { getUserID } from "../(auth)/actions";
import { revalidatePath } from "next/cache";
import { DatabaseError, NotAuthenticatedError } from "@/app/customerrors";

export async function getMovieData(movieIds: number[]): Promise<TMovieInfo[]> {
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
			throw new Error("Unexpected schema from TMDB API.");
		}

		movieData.push(validated.data);
	});

	return movieData;
}

export async function getLikeCount(listId: number): Promise<number> {
	const supabase = createClient();

	const { count, error } = await supabase
		.from("likes")
		.select("*", { count: "exact", head: true })
		.eq("list_id", listId);

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while getting like count.");
	}

	return count as number;
}

export async function insertLike(postId: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("likes")
		.insert([{ user_id: await getUserID(), list_id: postId }])
		.select();

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while inserting the like.");
	}
}

export async function deleteLike(postId: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("likes")
		.delete()
		.eq("user_id", await getUserID())
		.eq("list_id", postId);

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while deleting the like.");
	}
}

export async function isUserLikedPost(postId: number): Promise<boolean> {
	const supabase = createClient();

	const userId = await getUserID();

	let { count, error } = await supabase
		.from("likes")
		.select("*", { count: "exact", head: true })
		.eq("list_id", postId)
		.eq("user_id", userId);

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while reaching database.");
	}

	if (count && count > 0) {
		return true;
	} else {
		return false;
	}
}

export async function getUsername(): Promise<string> {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while reaching database.");
	} else if (!user) {
		throw new NotAuthenticatedError("User is not authenticated.");
	}

	const { data, error: error2 } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", user?.id);

	if (error2) {
		console.error(error);
		throw new DatabaseError("Error while reaching database.");
	}

	return data[0].username;
}

export async function deleteList(listId: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase.from("lists").delete().eq("id", listId);
	if (error) {
		throw new DatabaseError("Error while deleting the list.");
	}

	revalidatePath("/", "layout");
}

export async function createList(
	title: string,
	movieIDs: number[],
): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("lists")
		.insert([{ user_id: await getUserID(), title: title, movies: movieIDs }])
		.select();
	if (error) {
		throw new DatabaseError("Error while inserting to the lists.");
	}

	revalidatePath("/", "layout");
}

export async function getSearchMovieResults(value: string) {
	const apiToken = process.env.TMDB_API_TOKEN;
	const apiURL = "https://api.themoviedb.org/3/search/movie";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${apiToken}`,
		},
	};

	const res = await fetch(`${apiURL}?query=${value}`, options);
	const results = (await res.json()).results.sort(
		(a: any, b: any) => b.popularity - a.popularity,
	);
	return results;
}
