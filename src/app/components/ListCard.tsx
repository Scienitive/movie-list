import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { getComments, getMovieData, isUserLikedPost } from "./actions";
import { TMovieInfo } from "./types";
import MovieCard from "./MovieCard";
import { getUserID } from "../(auth)/actions";
import { to } from "await-to-js";
import Link from "next/link";
import ListCardFooterContent from "@/app/components/ListCardFooterContent";

type props = {
	postId: number;
	authorUserId: string;
	username: string;
	title: string;
	movies: number[];
	likeCount: number;
};

export default async function ListCard({
	postId,
	authorUserId,
	username,
	title,
	movies,
	likeCount,
}: props) {
	const [movieDataResult, initialCommentDataResult, userIDResult] =
		await Promise.allSettled([
			getMovieData(movies),
			getComments(postId),
			getUserID(),
		]);

	// If somehow I don't get the movie data I just don't return that movie list
	if (movieDataResult.status === "rejected") {
		console.error(movieDataResult.reason);
		return;
	} else if (initialCommentDataResult.status === "rejected") {
		console.error(initialCommentDataResult.reason);
		return;
	}

	let userID: string | undefined = undefined;
	if (userIDResult.status !== "rejected") {
		userID = userIDResult.value;
	}

	let userLike = false;
	if (userID) {
		const [error, data] = await to(isUserLikedPost(postId));
		if (error) {
			console.error(error);
			return;
		} else {
			userLike = data;
		}
	}

	return (
		<Card className="flex w-11/12 flex-col border-1 bg-ml-white/10 md:w-4/5 lg:w-3/5">
			<CardHeader className="flex items-center justify-between px-6 py-2 text-ml-white sm:px-8 sm:py-3">
				<h1 className="text-wrap break-words text-lg sm:text-2xl">{title}</h1>
				<Link
					href={`/p/${username}`}
					className="text-base text-ml-red sm:text-xl"
				>{`@${username}`}</Link>
			</CardHeader>
			<CardBody className="flex flex-row flex-wrap items-center justify-center gap-4 border-y-1 bg-ml-white/10 px-4 py-4 sm:gap-8 sm:px-8">
				{movieDataResult.value.map((json: TMovieInfo, index: number) => (
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
					initialCommentData={initialCommentDataResult.value}
				/>
			</CardFooter>
		</Card>
	);
}
