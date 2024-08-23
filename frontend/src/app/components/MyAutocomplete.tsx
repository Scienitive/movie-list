"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useState } from "react";

type props = {
	apiToken: string;
	setMovies: Function;
	modalOnClose: Function;
};

type MovieList = {
	id: number;
	title: string;
	releaseYear: number;
	posterPath: string;
};

export default function MyAutocomplete({
	apiToken,
	setMovies,
	modalOnClose,
}: props) {
	const [movieList, setMovieList] = useState<MovieList[]>([]);

	const apiURL = "https://api.themoviedb.org/3/search/movie";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${apiToken}`,
		},
	};

	const inputChange = async (value: string) => {
		if (!value) {
			return;
		}
		const res = await fetch(`${apiURL}?query=${value}`, options);
		const results = (await res.json()).results.sort(
			(a: any, b: any) => b.popularity - a.popularity,
		);

		const newMovieList: MovieList[] = [];
		results.forEach((result: any) => {
			if (
				!result.id ||
				!result.title ||
				!result.release_date ||
				!result.poster_path
			) {
				return;
			}

			const mv: MovieList = {
				id: result.id,
				title: result.title,
				releaseYear: result.release_date.split("-")[0],
				posterPath: result.poster_path,
			};

			newMovieList.push(mv);
		});

		setMovieList(newMovieList);
	};

	const selectionChange = (key: React.Key | null) => {
		if (!key) {
			return;
		}

		setMovies((prevItems) => [
			...prevItems,
			{
				id: key.toString(),
				posterPath: movieList.find(
					(movie) => movie.id.toString() === key.toString(),
				)?.posterPath,
			},
		]);

		modalOnClose();
	};

	return (
		<Autocomplete
			aria-label="Movie Name"
			onInputChange={inputChange}
			onSelectionChange={selectionChange}
		>
			{movieList.map((movie) => (
				<AutocompleteItem
					key={movie.id}
				>{`${movie.title} (${movie.releaseYear})`}</AutocompleteItem>
			))}
		</Autocomplete>
	);
}
