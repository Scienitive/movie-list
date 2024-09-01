"use client";

import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { FaRegHeart } from "react-icons/fa";

type props = {
	likeCount: number;
};

export default function NoAuthLikeButton({ likeCount }: props) {
	const handleClick = () => {
		toast.error("You need to login to like a list.", {
			id: "NoAuthLikeButton",
		});
	};

	return (
		<div className="flex gap-[2px] sm:gap-2">
			<Button
				isIconOnly
				disableRipple={true}
				className="bg-transparent text-ml-white"
				onClick={handleClick}
			>
				<FaRegHeart className="text-3xl sm:text-8xl" />
			</Button>
			<p className="mt-0.5 text-[26px] text-ml-red sm:mt-0 sm:text-4xl">
				{likeCount}
			</p>
		</div>
	);
}
