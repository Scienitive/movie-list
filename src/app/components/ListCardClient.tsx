"use client";

import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Link,
} from "@nextui-org/react";
import { getMovieData, isUserLikedPost } from "./actions";
import { TMovieInfo } from "./types";
import MovieCard from "./MovieCard";
import { getUserID } from "../(auth)/actions";
import { useEffect, useState } from "react";
import ListCardFooterContent from "@/app/components/ListCardFooterContent";

type props = {
	postId: number;
	authorUserId: string;
	username: string;
	title: string;
	movies: number[];
	likeCount: number;
	userLike: boolean;
	userID: string | undefined;
	className?: string;
};

export default function ListCardClient({
	postId,
	authorUserId,
	username,
	title,
	movies,
	likeCount,
	userLike,
	userID,
	className,
}: props) {
	const [data, setData] = useState<TMovieInfo[]>([]);
	// const [userID, setUserID] = useState<string | undefined>(undefined);

	const initialFunction = async () => {
		const [movieDataResult] = await Promise.allSettled([getMovieData(movies)]);

		// If somehow I don't get the movie data I just don't return that movie list
		if (movieDataResult.status === "rejected") {
			console.error(movieDataResult.reason);
			return;
		}
		setData(movieDataResult.value);
	};

	useEffect(() => {
		initialFunction();
	}, []);

	return (
		<Card
			className={
				"flex w-11/12 flex-col border-1 bg-ml-white/10 md:w-4/5 lg:w-3/5" +
				" " +
				className
			}
		>
			<CardHeader className="flex items-center justify-between px-6 py-2 text-ml-white sm:px-8 sm:py-3">
				<h1 className="text-wrap break-words text-lg sm:text-2xl">{title}</h1>
				<Link
					href={`/p/${username}`}
					className="text-base text-ml-red sm:text-xl"
				>{`@${username}`}</Link>
			</CardHeader>
			<CardBody className="flex flex-row flex-wrap items-center justify-center gap-4 border-y-1 bg-ml-white/10 px-4 py-4 sm:gap-8 sm:px-8">
				{data.map((json: TMovieInfo, index: number) => (
					<MovieCard key={index} json={json} />
				))}
			</CardBody>
			<CardFooter className="flex flex-col px-6 py-2 sm:px-8 sm:py-3">
				<ListCardFooterContent
					key={postId}
					userID={userID}
					authorUserId={authorUserId}
					postId={postId}
					likeCount={likeCount}
					userLike={userLike}
					initialCommentData={{ commentData: [], next: false }}
				/>
			</CardFooter>
		</Card>
	);
}
