"use client";

import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { deleteLike, insertLike } from "./actions";
import to from "await-to-js";
import toast from "react-hot-toast";

type props = {
	postId: number;
	likeCount: number;
	didUserLike: boolean;
};

export default function LikeButton({ postId, likeCount, didUserLike }: props) {
	const [userLike, setUserLike] = useState<boolean>(didUserLike);
	const [dynamicLikeCount, setDynamicLikeCount] = useState<number>(likeCount);
	const [disabled, setDisabled] = useState<boolean>(false);

	const handleClick = async () => {
		setDisabled(true);
		const func = userLike ? deleteLike : insertLike;
		const [error] = await to(func(postId));
		if (error) {
			toast.error(error.message, { id: "LikeButtonError" });
			setDisabled(false);
			return;
		}
		userLike
			? setDynamicLikeCount((current) => {
					return current - 1;
				})
			: setDynamicLikeCount((current) => {
					return current + 1;
				});
		setUserLike(!userLike);
		setDisabled(false);
	};

	return (
		<div className="flex gap-[2px] sm:gap-2">
			<Button
				isIconOnly
				disableRipple={true}
				className={clsx("bg-transparent", {
					"text-ml-red": userLike,
					"text-ml-white": !userLike,
				})}
				onClick={handleClick}
				disabled={disabled}
			>
				{userLike ? (
					<FaHeart className="text-3xl sm:text-8xl" />
				) : (
					<FaRegHeart className="text-3xl sm:text-8xl" />
				)}
			</Button>
			<p className="mt-0.5 text-[26px] text-ml-red sm:mt-0 sm:text-4xl">
				{dynamicLikeCount}
			</p>
		</div>
	);
}
