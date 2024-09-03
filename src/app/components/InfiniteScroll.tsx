"use client";

import ListCardClient from "@/app/components/ListCardClient";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getListData } from "@/app/(home)/actions";
import { getComments } from "@/app/components/actions";
import { TComment } from "@/app/components/types";
import { Spinner } from "@nextui-org/react";

type ListData = {
	postId: number;
	authorUserId: string;
	username: string;
	title: string;
	movies: number[];
	likeCount: number;
	userLike: boolean;
	initialCommentData: { commentData: TComment[]; next: boolean };
};

type props = {
	userID: string | undefined;
	username: string | undefined;
	lastListID: number | undefined;
	lastListLikeCount: number | undefined;
};

export default function InfiniteScroll({
	userID,
	username,
	lastListID,
	lastListLikeCount,
}: props) {
	const searchParams = useSearchParams();
	const [listData, setListData] = useState<ListData[]>([]);
	const [isBottom, setIsBottom] = useState(false);
	const [loading, setLoading] = useState<boolean>(false);

	const sortParam: string = (searchParams.get("sort") as string) || "new";
	const timeParam: string = (searchParams.get("time") as string) || "all";

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
				setIsBottom(true);
			} else {
				setIsBottom(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const action = async () => {
			if (loading) {
				return;
			}

			setLoading(true);
			const data = await getListData(
				userID ? userID : null,
				sortParam,
				timeParam,
				username ? username : null,
				listData.length > 0 ? listData[listData.length - 1].postId : lastListID,
				listData.length > 0
					? listData[listData.length - 1].likeCount
					: lastListLikeCount,
			);

			const newData: ListData[] = await Promise.all(
				data.map(async (item) => {
					const commentData = await getComments(item.id);
					return {
						postId: item.id,
						authorUserId: item.author_id,
						username: item.author_username,
						title: item.title,
						movies: item.movies,
						likeCount: item.like_count,
						userLike: item.user_like,
						initialCommentData: commentData,
					};
				}),
			);
			setListData((prev) => [...prev, ...newData]);
			setLoading(false);
		};

		if (isBottom) {
			action();
		}
	}, [isBottom]);

	return (
		<>
			{listData.map((data: ListData) => (
				<ListCardClient
					key={data.postId}
					postId={data.postId}
					authorUserId={data.authorUserId}
					username={data.username}
					title={data.title}
					movies={data.movies}
					likeCount={data.likeCount}
					userLike={data.userLike}
					userID={userID}
					initialCommentData={data.initialCommentData}
				/>
			))}
			{loading && (
				<Spinner
					size="lg"
					classNames={{
						circle1: "border-b-ml-red",
						circle2: "border-b-ml-red",
					}}
				/>
			)}
		</>
	);
}
