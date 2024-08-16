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
				{userLike ? <FaHeart size={120} /> : <FaRegHeart size={120} />}
			</Button>
			<p className="text-4xl text-ml-red">{dynamicLikeCount}</p>
		</div>
	);
}
