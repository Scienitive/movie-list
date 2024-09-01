"use client";

import Link from "next/link";
import CommentLikeButton from "@/app/components/CommentLikeButton";
import { Button } from "@nextui-org/react";
import { TComment } from "@/app/components/types";
import { FaRegCommentAlt } from "react-icons/fa";
import { useState } from "react";
import { getCommentReplies } from "@/app/components/actions";
import CommentInput from "@/app/components/CommentInput";
import DeleteCommentButton from "@/app/components/DeleteCommentButton";
import toast from "react-hot-toast";
import to from "await-to-js";

type props = {
	userID: string | undefined;
	listID: number;
	commentData: TComment;
};

export default function Comment({ userID, listID, commentData }: props) {
	const [isReplyOpenedBefore, setIsReplyOpenedBefore] =
		useState<boolean>(false);
	const [showReplies, setShowReplies] = useState<boolean>(false);
	const [showRepliesLoading, setShowRepliesLoading] = useState<boolean>(false);
	const [replyButtonLoading, setReplyButtonLoading] = useState<boolean>(false);
	const [replies, setReplies] = useState<TComment[]>([]);

	const [loadMoreRepliesActive, setLoadMoreRepliesActive] =
		useState<boolean>(false);
	const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);

	const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
	const [deleted, setDeleted] = useState<boolean>(commentData.isDeleted);
	const [repliesDeleted, setRepliesDeleted] = useState<boolean[]>([]);

	const handleClick = async () => {
		setShowRepliesLoading(true);
		if (showReplies) {
			setShowReplies(false);
			setShowRepliesLoading(false);
			setShowCommentInput(false);
			return;
		}

		setShowReplies(true);
		if (isReplyOpenedBefore) {
			setShowRepliesLoading(false);
			return;
		}

		setIsReplyOpenedBefore(true);

		const [error, data] = await to(getCommentReplies(commentData.id));
		if (error) {
			toast.error(error.message, { id: "GetCommentRepliesError" });
			setShowRepliesLoading(false);
			return;
		}
		setReplies(data.commentData);
		setRepliesDeleted(data.commentData.map(() => false));
		setLoadMoreRepliesActive(data.next);

		setShowRepliesLoading(false);
	};

	const handleReplyClick = async () => {
		if (!userID) {
			toast.error("You need to login to reply a comment.", {
				id: "NoLoginReplyError",
			});
			return;
		}
		setShowReplies(true);
		setReplyButtonLoading(true);
		if (!isReplyOpenedBefore) {
			setIsReplyOpenedBefore(true);
			setShowRepliesLoading(true);
			const [error, data] = await to(getCommentReplies(commentData.id));
			if (error) {
				toast.error(error.message, { id: "GetCommentRepliesError" });
				setShowRepliesLoading(false);
				setReplyButtonLoading(false);
				return;
			}
			setReplies(data.commentData);
			setRepliesDeleted(data.commentData.map(() => false));
			setLoadMoreRepliesActive(data.next);
			setShowRepliesLoading(false);
		}

		setShowCommentInput(true);
		setReplyButtonLoading(false);
	};

	const setNewReply = (newReply: TComment) => {
		setReplies((prev) => [newReply, ...prev]);
		setRepliesDeleted((prev) => [false, ...prev]);
	};

	const loadMoreOnClick = async () => {
		setLoadMoreLoading(true);

		const [error, data] = await to(
			getCommentReplies(
				commentData.id,
				replies.length > 0 ? replies[replies.length - 1].id : null,
			),
		);
		if (error) {
			toast.error(error.message, { id: "GetCommentRepliesError" });
			setLoadMoreLoading(false);
			return;
		}
		setReplies((prev) => [...prev, ...data.commentData]);
		setRepliesDeleted((prev) => [
			...prev,
			...data.commentData.map(() => false),
		]);
		setLoadMoreRepliesActive(data.next);

		setLoadMoreLoading(false);
	};

	const setReplyDeleted = (index: number) => {
		setRepliesDeleted((prev) =>
			prev.map((data, i) => {
				if (i !== index) {
					return data;
				} else {
					return true;
				}
			}),
		);
	};

	return (
		<div className="flex flex-col items-end">
			<div className="flex w-full flex-col rounded-lg bg-ml-white/10 px-3 py-1 text-ml-white sm:px-4">
				<div className="flex flex-row justify-start gap-2">
					{!deleted ? (
						<p className="text-sm sm:text-base">
							<Link
								href={`/p/${commentData.username}`}
								className="mr-[6px] text-ml-red"
							>{`@${commentData.username}:`}</Link>
							{commentData.text}
						</p>
					) : (
						<p className="text-sm text-ml-white/50 sm:text-base">
							<Link
								href={`/p/${commentData.username}`}
								className="mr-[6px] text-ml-red"
							>{`@${commentData.username}:`}</Link>

							{"[deleted]"}
						</p>
					)}
				</div>
				<div className="flex flex-row gap-1 sm:-mt-[2px] sm:gap-2">
					{(!deleted || (deleted && commentData.replyCount > 0)) && (
						<CommentLikeButton
							userID={userID}
							commentID={commentData.id}
							likeCount={commentData.likeCount}
							didUserLike={commentData.didUserLike}
						/>
					)}
					{(!deleted || (deleted && commentData.replyCount > 0)) && (
						<Button
							className="h-6 min-h-6 min-w-[58px] gap-1 bg-transparent px-0 text-xs text-ml-white sm:min-w-20 sm:gap-2 sm:text-sm"
							spinnerPlacement="start"
							startContent={
								!replyButtonLoading && <FaRegCommentAlt className="text-sm" />
							}
							disableRipple={true}
							onClick={handleReplyClick}
							isLoading={replyButtonLoading}
						>
							Reply
						</Button>
					)}
					{(commentData.replyCount > 0 || replies.length > 0) && (
						<Button
							disableRipple={true}
							className="h-6 min-h-6 min-w-[76px] bg-transparent px-0 text-xs text-ml-white sm:min-w-20 sm:text-sm"
							onClick={handleClick}
							spinnerPlacement="start"
							isLoading={showRepliesLoading}
						>
							{showReplies ? `Hide Replies` : `View Replies`}
						</Button>
					)}
					{!deleted && userID === commentData.authorID && (
						<DeleteCommentButton
							commentID={commentData.id}
							setDeleted={setDeleted}
						/>
					)}
				</div>
			</div>
			{showReplies && (
				<div className="mt-2 flex w-11/12 flex-col items-center gap-2">
					{showCommentInput && (
						<CommentInput
							listID={listID}
							commentID={commentData.id}
							setNewComment={setNewReply}
						/>
					)}
					{replies.length > 0 && (
						<div className="flex w-full flex-col gap-2">
							{replies.map((reply, index) => (
								<div
									key={reply.id}
									className="flex flex-col rounded-lg bg-ml-white/10 px-3 py-1 text-ml-white sm:px-4"
								>
									<div className="flex flex-row justify-start gap-2">
										{!repliesDeleted[index] ? (
											<p className="text-sm sm:text-base">
												<Link
													href={`/p/${reply.username}`}
													className="mr-[6px] text-ml-red"
												>{`@${reply.username}:`}</Link>
												{reply.text}
											</p>
										) : (
											<p className="text-sm text-ml-white/50 sm:text-base">
												<Link
													href={`/p/${reply.username}`}
													className="mr-[6px] text-ml-red"
												>{`@${reply.username}:`}</Link>
												{"[deleted]"}
											</p>
										)}
									</div>
									<div className="flex flex-row gap-2">
										{!repliesDeleted[index] && (
											<CommentLikeButton
												userID={userID}
												commentID={reply.id}
												likeCount={reply.likeCount}
												didUserLike={reply.didUserLike}
											/>
										)}
										{!repliesDeleted[index] && (
											<Button
												className="h-6 min-h-6 min-w-[58px] gap-1 bg-transparent px-0 text-xs text-ml-white sm:min-w-20 sm:gap-2 sm:text-sm"
												startContent={<FaRegCommentAlt className="text-sm" />}
												disableRipple={true}
												onClick={handleReplyClick}
											>
												Reply
											</Button>
										)}
										{!repliesDeleted[index] && userID === reply.authorID && (
											<DeleteCommentButton
												commentID={reply.id}
												setReplyDeleted={() => {
													setReplyDeleted(index);
												}}
											/>
										)}
									</div>
								</div>
							))}
						</div>
					)}
					{loadMoreRepliesActive && (
						<Button
							disableRipple={true}
							spinnerPlacement="end"
							className="h-4 bg-transparent text-xs text-ml-white sm:text-sm"
							isLoading={loadMoreLoading}
							onClick={loadMoreOnClick}
						>
							Load More Replies
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
