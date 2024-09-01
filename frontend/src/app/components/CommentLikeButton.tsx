"use client";

import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { deleteCommentLike, insertCommentLike } from "./actions";
import toast from "react-hot-toast";
import to from "await-to-js";

type props = {
	userID: string | undefined;
	commentID: number;
	likeCount: number;
	didUserLike: boolean;
};

export default function CommentLikeButton({
	userID,
	commentID,
	likeCount,
	didUserLike,
}: props) {
	const [userLike, setUserLike] = useState<boolean>(didUserLike);
	const [dynamicLikeCount, setDynamicLikeCount] = useState<number>(likeCount);

	const handleClick = async () => {
		if (!userID) {
			toast.error("You need to login to like a comment.", {
				id: "NoLoginCommentLikeError",
			});
			return;
		}
		const func = userLike ? deleteCommentLike : insertCommentLike;
		const [error] = await to(func(commentID));
		if (error) {
			toast.error(error.message, { id: "CommentLikeButtonError" });
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
	};

	return (
		<div className="-mt-[1px] flex items-center justify-center">
			<Button
				isIconOnly
				disableRipple={true}
				className={clsx("h-6 min-h-6 w-6 min-w-6 bg-transparent", {
					"text-ml-red": userLike,
					"text-ml-white": !userLike,
				})}
				onClick={handleClick}
			>
				{userLike ? (
					<FaHeart className="text-sm sm:text-base" />
				) : (
					<FaRegHeart className="text-sm sm:text-base" />
				)}
			</Button>
			<p className="-ml-[2px] mt-[1px] text-sm text-ml-red sm:-ml-0 sm:mt-[2px] sm:text-base">
				{dynamicLikeCount}
			</p>
		</div>
	);
}
