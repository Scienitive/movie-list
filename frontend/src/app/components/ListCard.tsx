import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { getMovieData, isUserLikedPost } from "./actions";
import { TMovieInfo } from "./types";
import MovieCard from "./MovieCard";
import LikeButton from "./LikeButton";
import { getUserID } from "../(auth)/actions";
import DeleteListButton from "./DeleteListButton";
import { to } from "await-to-js";

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
	const [movieDataResult, userIDResult] = await Promise.allSettled([
		getMovieData(movies),
		getUserID(),
	]);

	// If somehow I don't get the movie data I just don't return that movie list
	if (movieDataResult.status === "rejected") {
		console.error(movieDataResult.reason);
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
		<Card className="flex w-3/5 flex-col border-1 bg-ml-white/10">
			<CardHeader className="flex items-center justify-between px-8 text-ml-white">
				<h1 className="text-wrap text-2xl">{title}</h1>
				<p className="text-xl text-ml-red">{`@${username}`}</p>
			</CardHeader>
			<CardBody className="flex flex-row flex-wrap justify-center gap-8 border-y-1 bg-ml-white/10 px-8">
				{movieDataResult.value.map((json: TMovieInfo, index: number) => (
					<MovieCard key={index} json={json} />
				))}
			</CardBody>
			<CardFooter className="flex flex-col px-8">
				<div className="flex w-full justify-between">
					{userID ? (
						<LikeButton
							postId={postId}
							likeCount={likeCount}
							didUserLike={userLike}
						/>
					) : (
						<p className="text-ml-white">OR</p>
					)}
					{userID && userID === authorUserId && (
						<DeleteListButton postId={postId} />
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
