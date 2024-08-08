"use server";

import { movieInfoSchema, TAction, TMovieInfo } from "./types";

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
