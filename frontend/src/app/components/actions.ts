"use server";

import { createClient } from "@/utils/supabase/server";
import { movieInfoSchema, TComment, TMovieInfo } from "./types";
import { getUserID } from "../(auth)/actions";
import { revalidatePath } from "next/cache";
import {
	DatabaseError,
	NotAuthenticatedError,
	TypeValidationError,
} from "@/app/customerrors";
import to from "await-to-js";

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

export async function getComments(
	listId: number,
	lastCommentID: number | null = null,
): Promise<TComment[]> {
	const supabase = createClient();

	let userID: string | null = null;
	const [userError, userData] = await to(getUserID());
	if (!userError && userData) {
		userID = userData;
	}

	let returnData: TComment[] = [];
	const { data, error } = await supabase.rpc("get_comments", {
		arg_list_id: listId,
		arg_comment_id: null,
		arg_is_reply: false,
		arg_user_id: userID,
		arg_last_comment_id: lastCommentID,
	});
	if (error) {
		throw new DatabaseError(error.message);
	}

	data.forEach((data: any) => {
		returnData.push({
			id: data.id,
			text: data.text,
			replyCount: data.reply_count,
			isDeleted: data.is_deleted,
			username: data.username,
			likeCount: data.like_count,
			didUserLike: data.diduserlike,
		});
	});

	return returnData;
}

export async function getCommentReplies(
	commentID: number,
	lastReplyID: number | null = null,
) {
	const supabase = createClient();

	let userID: string | null = null;
	const [userError, userData] = await to(getUserID());
	if (!userError && userData) {
		userID = userData;
	}

	let returnData: TComment[] = [];
	const { data, error } = await supabase.rpc("get_comments", {
		arg_list_id: null,
		arg_comment_id: commentID,
		arg_is_reply: true,
		arg_user_id: userID,
		arg_last_comment_id: lastReplyID,
	});
	if (error) {
		throw new DatabaseError(error.message);
	}

	data.forEach((data: any) => {
		returnData.push({
			id: data.id,
			text: data.text,
			replyCount: data.reply_count,
			isDeleted: data.is_deleted,
			username: data.username,
			likeCount: data.like_count,
			didUserLike: data.diduserlike,
		});
	});

	return returnData;
}

export async function getCommentLikeCount(commentID: number): Promise<number> {
	const supabase = createClient();

	const { count, error } = await supabase
		.from("comment_likes")
		.select("*", { count: "exact", head: true })
		.eq("comment_id", commentID);

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while getting comment like count.");
	}

	return count as number;
}

export async function getCommentDoesUserLike(
	commentID: number,
): Promise<boolean> {
	const supabase = createClient();

	const [userIDError, userID] = await to(getUserID());
	if (!userID) {
		return false;
	}

	const { count, error } = await supabase
		.from("comment_likes")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userID)
		.eq("comment_id", commentID);
	if (error) {
		console.error(error);
		throw new DatabaseError("Error while getting comment like count.");
	}

	return count ? true : false;
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

export async function insertCommentLike(commentID: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("comment_likes")
		.insert([{ user_id: await getUserID(), comment_id: commentID }])
		.select();

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while inserting the like.");
	}
}

export async function deleteCommentLike(commentID: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("likes")
		.delete()
		.eq("user_id", await getUserID())
		.eq("comment_id", commentID);

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
		throw new DatabaseError(error.message);
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
		(a: any, b: any) => b.vote_count - a.vote_count,
	);
	return results;
}

export async function saveSettings(username: string) {
	const usernameRegex = /^[A-Za-z0-9_]{3,12}$/;

	if (!username.match(usernameRegex)) {
		throw new TypeValidationError("This username is not valid.");
	}

	const supabase = createClient();

	const { error } = await supabase
		.from("profiles")
		.update({ username: username })
		.eq("id", await getUserID())
		.select();
	if (error) {
		if (error.code === "23505") {
			throw new DatabaseError("That username is taken.");
		} else {
			throw new DatabaseError("Error while inserting to the lists.");
		}
	}

	revalidatePath("/settings", "layout");
}
