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
			letterboxdURL: `https://letterboxd.com/tmdb/${jsonData.id}`,
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
	lastCommentLikeCount: number | null = null,
): Promise<{ commentData: TComment[]; next: boolean }> {
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
		arg_last_comment_like_count: lastCommentLikeCount,
	});
	if (error) {
		throw new DatabaseError("Error while retrieving comments.");
	}

	data.forEach((data: any) => {
		returnData.push({
			id: data.id,
			text: data.text,
			replyCount: data.reply_count,
			isDeleted: data.is_deleted,
			authorID: data.author_id,
			username: data.username,
			likeCount: data.like_count,
			didUserLike: data.diduserlike,
		});
	});

	if (returnData.length <= 0) {
		return { commentData: returnData, next: false };
	}

	const { data: next } = await supabase.rpc("next_comment_exists", {
		arg_list_id: listId,
		arg_last_comment_id: returnData[returnData.length - 1].id,
		arg_last_comment_like_count: returnData[returnData.length - 1].likeCount,
	});

	return { commentData: returnData, next: next };
}

export async function getCommentReplies(
	commentID: number,
	lastReplyID: number | null = null,
): Promise<{ commentData: TComment[]; next: boolean }> {
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
		console.error(error);
		throw new DatabaseError("Error while retrieving comments.");
	}

	data.forEach((data: any) => {
		returnData.push({
			id: data.id,
			text: data.text,
			replyCount: data.reply_count,
			isDeleted: data.is_deleted,
			authorID: data.author_id,
			username: data.username,
			likeCount: data.like_count,
			didUserLike: data.diduserlike,
		});
	});

	if (returnData.length <= 0) {
		return { commentData: returnData, next: false };
	}

	const { count } = await supabase
		.from("comments")
		.select("*", { count: "exact", head: true })
		.eq("parent", commentID)
		.gt("id", returnData[returnData.length - 1].id)
		.limit(1);

	return { commentData: returnData, next: !!count };
}

export async function insertComment(
	listID: number,
	text: string,
): Promise<number> {
	const supabase = createClient();

	const userID = await getUserID();

	const { data, error } = await supabase
		.from("comments")
		.insert([{ user_id: userID, list_id: listID, text: text, is_reply: false }])
		.select()
		.single();
	if (error) {
		throw new DatabaseError("Error while inserting a comment.");
	}

	return data.id;
}

export async function insertCommentReply(
	listID: number,
	commentID: number,
	text: string,
): Promise<number> {
	const supabase = createClient();

	const userID = await getUserID();

	const { data, error } = await supabase
		.from("comments")
		.insert([
			{
				user_id: userID,
				list_id: listID,
				text: text,
				is_reply: true,
				parent: commentID,
			},
		])
		.select()
		.single();
	if (error) {
		console.log(error);
		if (error.code === "23503") {
			throw new DatabaseError(
				"The comment that you're replying to doesn't exist.",
			);
		} else {
			throw new DatabaseError(error.message);
		}
	}

	return data.id;
}

export async function insertLike(postId: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("likes")
		.insert([{ user_id: await getUserID(), list_id: postId }])
		.select();

	if (error) {
		console.error(error);
		throw new DatabaseError("Error while inserting a like.");
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
		throw new DatabaseError("Error while deleting a like.");
	}
}

export async function insertCommentLike(commentID: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("comment_likes")
		.insert([{ user_id: await getUserID(), comment_id: commentID }])
		.select();

	if (error) {
		console.log(error);
		if (error.code === "23503") {
			throw new DatabaseError("The comment that you like doesn't exist.");
		} else {
			throw new DatabaseError(error.message);
		}
	}
}

export async function deleteCommentLike(commentID: number): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.from("comment_likes")
		.delete()
		.eq("user_id", await getUserID())
		.eq("comment_id", commentID);

	if (error) {
		console.log(error);
		if (error.code === "23503") {
			throw new DatabaseError("Error while deleting a like.");
		} else {
			throw new DatabaseError(error.message);
		}
	}
}

export async function deleteComment(commentID: number): Promise<void> {
	const supabase = createClient();

	const { data, error: error2 } = await supabase
		.from("comments")
		.select("replies")
		.eq("id", commentID)
		.single();
	if (error2) {
		throw new DatabaseError(error2.message);
	}

	if (!data.replies || data.replies.length === 0) {
		const { error } = await supabase
			.from("comments")
			.delete()
			.eq("id", commentID);
		if (error) {
			throw new DatabaseError(error.message);
		}
	} else {
		const { error } = await supabase
			.from("comments")
			.update({ text: "[deleted]", is_deleted: true })
			.eq("id", commentID)
			.select();
		if (error) {
			throw new DatabaseError(error.message);
		}
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

	if (movieIDs.length > 15) {
		throw new DatabaseError("You can't add more than 15 movies to a list.");
	}

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
	const usernameRegex = /^[A-Za-z0-9_]{3,16}$/;

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
