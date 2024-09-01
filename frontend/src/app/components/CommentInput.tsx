"use client";

import { Button } from "@nextui-org/react";
import { CgMailReply } from "react-icons/cg";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import toast from "react-hot-toast";
import {
	getUsername,
	insertComment,
	insertCommentReply,
} from "@/app/components/actions";
import { TComment } from "@/app/components/types";
import { getUserID } from "@/app/(auth)/actions";
import to from "await-to-js";

type props = {
	listID: number;
	commentID?: number;
	setNewComment: Function;
};

const CommentInput = forwardRef<HTMLTextAreaElement, props>(
	({ listID, commentID, setNewComment }, ref) => {
		const [isLoading, setIsLoading] = useState<boolean>(false);

		useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);
		const textareaRef = useRef<HTMLTextAreaElement>(null);

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
				const [error, data] = await to(
					insertComment(listID, textareaRef.current.value),
				);
				if (error) {
					toast.error(error.message);
					setIsLoading(false);
					return;
				}
				newCommentID = data;
			} else {
				const [error, data] = await to(
					insertCommentReply(listID, commentID, textareaRef.current.value),
				);
				if (error) {
					toast.error(error.message);
					setIsLoading(false);
					return;
				}
				newCommentID = data;
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
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
			textareaRef.current.disabled = false;
			setIsLoading(false);
		};

		return (
			<div className="flex w-full flex-row items-end rounded-lg bg-ml-white/10 px-3 py-1 sm:px-4">
				<textarea
					ref={textareaRef}
					placeholder="Enter your comment..."
					className="h-auto flex-grow resize-none overflow-hidden bg-transparent text-sm text-ml-white focus:outline-none sm:text-base"
					rows={1}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
						}
					}}
					onInput={(e) => {
						const textarea = e.target as HTMLTextAreaElement;
						textarea.style.height = "auto";
						textarea.style.height = `${textarea.scrollHeight}px`;
					}}
					autoFocus
				/>
				<Button
					isIconOnly={true}
					className="h-5 min-h-5 w-5 min-w-5 rounded-full border-1 border-ml-white bg-transparent text-ml-white sm:h-6 sm:min-h-6 sm:w-6 sm:min-w-6"
					isLoading={isLoading}
					onClick={handleClick}
				>
					<CgMailReply className="text-xs sm:text-sm" />
				</Button>
			</div>
		);
	},
);

CommentInput.displayName = "CommentInput";
export default CommentInput;
