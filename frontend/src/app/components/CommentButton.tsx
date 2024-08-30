"use client";

import { Button } from "@nextui-org/react";
import { FaRegComment } from "react-icons/fa";

type props = {
	setCommentActive: Function;
};

export default function CommentButton({ setCommentActive }: props) {
	return (
		<>
			<Button
				isIconOnly
				disableRipple={true}
				className="bg-transparent text-ml-white"
				onClick={() => {
					setCommentActive(true);
				}}
			>
				<FaRegComment className="text-4xl sm:text-8xl" />
			</Button>
		</>
	);
}
