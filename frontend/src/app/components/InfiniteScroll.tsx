"use client";

import ListCardClient from "@/app/components/ListCardClient";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getListData } from "@/app/(home)/actions";

type ListData = {
	postId: number;
	authorUserId: string;
	username: string;
	title: string;
	movies: number[];
	likeCount: number;
};

type props = {
	username: string | undefined;
	lastListID: number | undefined;
};

export default function InfiniteScroll({ username, lastListID }: props) {
	const searchParams = useSearchParams();
	const [listData, setListData] = useState<ListData[]>([]);
	const [isBottom, setIsBottom] = useState(false);

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
			const newData: ListData[] = [];
			const data = await getListData(
				sortParam,
				timeParam,
				username,
				listData.length > 0 ? listData[listData.length - 1].postId : lastListID,
			);
			data.forEach((data) => {
				newData.push({
					postId: data.id,
					authorUserId: data.author_id,
					username: data.author_username,
					title: data.title,
					movies: data.movies,
					likeCount: data.like_count,
				});
			});
			setListData((prev) => [...prev, ...newData]);
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
				/>
			))}
		</>
	);
}
