import { z } from "zod";

export type TAction = {
	error?: string;
	data?: any;
};

export const movieInfoSchema = z.object({
	title: z.string(),
	releaseYear: z.string(),
	posterPath: z.string(),
});
export type TMovieInfo = z.infer<typeof movieInfoSchema>;
