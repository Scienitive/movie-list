"use client";

import { getSearchMovieResults } from "@/app/components/actions";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";

type MovieData = {
	id: number;
	posterPath: string;
};

type MovieList = {
	id: number;
	title: string;
	releaseYear: number;
	posterPath: string;
};

type props = {
	movies: MovieData[];
	setMovies: Function;
	modalOnClose: Function;
};

export default function MyAutocomplete({
	movies,
	setMovies,
	modalOnClose,
}: props) {
	const [movieList, setMovieList] = useState<MovieList[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const debounced = useDebouncedCallback(async (value) => {
		if (!value) {
			return;
		}

		setLoading(true);

		const results = await getSearchMovieResults(value);

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
		setLoading(false);
	}, 300);

	const selectionChange = (key: React.Key | null) => {
		if (!key) {
			return;
		}

		console.log(movies);
		if (movies.some((movie) => movie.id.toString() === key.toString())) {
			toast.error("That movie already exists in the list.", {
				id: "DuplicateMovieError",
			});
			modalOnClose();
			return;
		}

		setMovies((prevItems: any) => [
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
		<div className="flex w-full flex-row justify-center bg-transparent">
			<Autocomplete
				aria-label="Movie Name"
				placeholder="Search a movie"
				size="lg"
				isLoading={loading}
				onInputChange={(value: string) => {
					debounced(value);
				}}
				onSelectionChange={selectionChange}
				className="w-11/12"
			>
				{movieList.map((movie) => (
					<AutocompleteItem
						key={movie.id}
					>{`${movie.title} (${movie.releaseYear})`}</AutocompleteItem>
				))}
			</Autocomplete>
		</div>
	);
}
