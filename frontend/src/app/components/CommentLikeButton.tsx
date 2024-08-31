"use client";

import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { deleteCommentLike, insertCommentLike } from "./actions";
import toast from "react-hot-toast";

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
		await func(commentID);
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
				className={clsx("bg-transparent sm:h-6 sm:min-h-6 sm:w-6 sm:min-w-6", {
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
			<p className="mt-[1px] text-ml-red sm:text-base">{dynamicLikeCount}</p>
		</div>
	);
}
