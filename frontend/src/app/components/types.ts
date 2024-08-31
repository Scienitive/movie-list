import { z } from "zod";

export type TAction = {
	error?: string;
	data?: any;
};

export type TComment = {
	id: number;
	text: string;
	replyCount: number;
	isDeleted: boolean;
	authorID: string;
	username: string;
	likeCount: number;
	didUserLike: boolean;
};

export const movieInfoSchema = z.object({
	title: z.string(),
	releaseYear: z.string(),
	posterPath: z.string(),
	imdbURL: z.string().url(),
	tmdbURL: z.string().url(),
});
export type TMovieInfo = z.infer<typeof movieInfoSchema>;
