"use client";

import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { FaRegComment } from "react-icons/fa";

export default function NoAuthCommentButton() {
	const handleClick = () => {
		toast.error("You need to login to see or make a comment.", {
			id: "NoAuthCommentButton",
		});
	};

	return (
		<Button
			isIconOnly
			disableRipple={true}
			className="bg-transparent text-ml-white"
			onClick={handleClick}
		>
			<FaRegComment className="text-4xl sm:text-8xl" />
		</Button>
	);
}
