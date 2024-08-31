"use client";

import { Button } from "@nextui-org/react";
import { CgMailReply } from "react-icons/cg";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
	getUsername,
	insertComment,
	insertCommentReply,
} from "@/app/components/actions";
import { TComment } from "@/app/components/types";
import { getUserID } from "@/app/(auth)/actions";

type props = {
	listID: number;
	commentID?: number;
	setNewComment: Function;
};

export default function CommentInput({
	listID,
	commentID,
	setNewComment,
}: props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleClick = async () => {
		if (!textareaRef.current) {
			toast.error("Internal Error.", { id: "NoTextArea" });
			return;
		} else if (!textareaRef.current.value) {
			toast.error("Comment can't be empty.", { id: "NoComment" });
			return;
		}

		setIsLoading(true);
		textareaRef.current.disabled = true;
		let newCommentID: number;
		if (!commentID) {
			newCommentID = await insertComment(listID, textareaRef.current.value);
		} else {
			newCommentID = await insertCommentReply(
				listID,
				commentID,
				textareaRef.current.value,
			);
		}

		const newComment: TComment = {
			id: newCommentID,
			text: textareaRef.current.value,
			replyCount: 0,
			isDeleted: false,
			authorID: await getUserID(),
			username: await getUsername(),
			likeCount: 0,
			didUserLike: false,
		};
		setNewComment(newComment);

		toast.success("Comment added successfully!", { id: "CommentSuccess" });
		textareaRef.current.value = "";
		textareaRef.current.disabled = false;
		setIsLoading(false);
	};

	return (
		<div className="flex w-full flex-row items-end rounded-lg bg-ml-white/10 px-4 py-1">
			<textarea
				ref={textareaRef}
				placeholder="Enter your comment..."
				className="h-auto flex-grow resize-none overflow-hidden bg-transparent text-lg text-ml-white focus:outline-none sm:text-base"
				rows={1}
				onInput={(e) => {
					const textarea = e.target as HTMLTextAreaElement;
					textarea.style.height = "auto";
					textarea.style.height = `${textarea.scrollHeight}px`;
				}}
				autoFocus
			/>
			<Button
				isIconOnly={true}
				className="bg-transparent text-ml-white sm:h-6 sm:min-h-6 sm:w-6 sm:min-w-6"
				isLoading={isLoading}
				onClick={handleClick}
			>
				<CgMailReply className="text-sm" />
			</Button>
		</div>
	);
}
