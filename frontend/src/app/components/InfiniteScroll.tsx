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

export default function InfiniteScroll() {
	const searchParams = useSearchParams();
	const [listData, setListData] = useState<ListData[]>([]);
	const [isBottom, setIsBottom] = useState(false);
	const [rangeNumber, setRangeNumber] = useState<number>(4);

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
			const data = await getListData(sortParam, timeParam, rangeNumber);
			data.forEach((data) => {
				newData.push({
					postId: data.id,
					authorUserId: data.user_id,
					username: data.profiles.username,
					title: data.title,
					movies: data.movies,
					likeCount: data.likes[0].count,
				});
			});
			setListData((prev) => [...prev, ...newData]);
			setRangeNumber((prev) => prev + newData.length);
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
