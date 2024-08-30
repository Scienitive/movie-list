"use client";

import Link from "next/link";
import CommentLikeButton from "@/app/components/CommentLikeButton";
import { Button } from "@nextui-org/react";
import { TComment } from "@/app/components/types";
import { FaRegCommentAlt } from "react-icons/fa";
import { useState } from "react";
import { getCommentReplies } from "@/app/components/actions";
import CommentInput from "@/app/components/CommentInput";

type props = {
	commentData: TComment;
};

export default function Comment({ commentData }: props) {
	const [isReplyOpenedBefore, setIsReplyOpenedBefore] =
		useState<boolean>(false);
	const [showReplies, setShowReplies] = useState<boolean>(false);
	const [showRepliesLoading, setShowRepliesLoading] = useState<boolean>(false);
	const [replies, setReplies] = useState<TComment[]>([]);

	const handleClick = async () => {
		setShowRepliesLoading(true);
		if (showReplies) {
			setShowReplies(false);
			setShowRepliesLoading(false);
			return;
		}

		setShowReplies(true);
		if (isReplyOpenedBefore) {
			setShowRepliesLoading(false);
			return;
		}

		setIsReplyOpenedBefore(true);
		setReplies(await getCommentReplies(commentData.id));
		setShowRepliesLoading(false);
	};

	return (
		<div className="flex flex-col items-end gap-2">
			<div className="flex w-full flex-col rounded-lg bg-ml-white/10 px-4 py-1 text-ml-white">
				<div className="flex flex-row justify-start gap-2">
					<Link
						href={`/p/${commentData.username}`}
						className="text-ml-red"
					>{`@${commentData.username}:`}</Link>
					<p>{commentData.text}</p>
				</div>
				<div className="flex flex-row gap-2">
					<CommentLikeButton
						commentID={commentData.id}
						likeCount={commentData.likeCount}
						didUserLike={commentData.didUserLike}
					/>
					<Button
						className="bg-transparent text-ml-white sm:h-6 sm:min-h-6"
						startContent={<FaRegCommentAlt className="text-sm" />}
						disableRipple={true}
					>
						Reply
					</Button>

					{commentData.replyCount && (
						<Button
							disableRipple={true}
							className="h-4 bg-transparent text-ml-white sm:h-6"
							onClick={handleClick}
							spinnerPlacement="end"
							isLoading={showRepliesLoading}
						>
							{showReplies
								? "Hide Replies"
								: `View Replies (${commentData.replyCount})`}
						</Button>
					)}
				</div>
			</div>
			<div className="flex w-11/12 flex-col gap-2">
				<CommentInput />
				{showReplies && (
					<div className="flex flex-col gap-2">
						{replies.map((reply) => (
							<div
								key={reply.id}
								className="flex flex-col rounded-lg bg-ml-white/10 px-4 py-1 text-ml-white"
							>
								<div className="flex flex-row justify-start gap-2">
									<Link
										href={`/p/${reply.username}`}
										className="text-ml-red"
									>{`@${reply.username}:`}</Link>
									<p>{reply.text}</p>
								</div>
								<div className="flex flex-row gap-2">
									<CommentLikeButton
										commentID={reply.id}
										likeCount={reply.likeCount}
										didUserLike={reply.didUserLike}
									/>
									<Button
										className="bg-transparent text-ml-white sm:h-6 sm:min-h-6"
										startContent={<FaRegCommentAlt className="text-sm" />}
										disableRipple={true}
									>
										Reply
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
