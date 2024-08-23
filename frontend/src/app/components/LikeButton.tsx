"use client";

import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { deleteLike, insertLike } from "./actions";

type props = {
	postId: number;
	likeCount: number;
	didUserLike: boolean;
};

export default function LikeButton({ postId, likeCount, didUserLike }: props) {
	const [userLike, setUserLike] = useState<boolean>(didUserLike);
	const [dynamicLikeCount, setDynamicLikeCount] = useState<number>(likeCount);

	useEffect(() => {
		setDynamicLikeCount(likeCount);
	}, [likeCount]);

	const handleClick = async () => {
		const func = userLike ? deleteLike : insertLike;
		await func(postId);
		userLike
			? setDynamicLikeCount((current) => {
					return current - 1;
				})
			: setDynamicLikeCount((current) => {
					return current + 1;
				});
		setUserLike(!userLike);
	};

	return (
		<div className="flex gap-2">
			<Button
				isIconOnly
				disableRipple={true}
				className={clsx("bg-transparent", {
					"text-ml-red": userLike,
					"text-ml-white": !userLike,
				})}
				onClick={handleClick}
			>
				{userLike ? (
					<FaHeart className="text-4xl sm:text-8xl" />
				) : (
					<FaRegHeart className="text-4xl sm:text-8xl" />
				)}
			</Button>
			<p className="mt-0.5 text-3xl text-ml-red sm:mt-0 sm:text-4xl">
				{dynamicLikeCount}
			</p>
		</div>
	);
}
