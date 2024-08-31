"use client";

import Comment from "@/app/components/Comment";
import { useState } from "react";
import { TComment } from "@/app/components/types";
import CommentInput from "@/app/components/CommentInput";
import { Button } from "@nextui-org/react";
import { getComments } from "@/app/components/actions";

type props = {
	userID: string | undefined;
	listID: number;
	initialCommentData: { commentData: TComment[]; next: boolean };
	commentInputActive: boolean;
};

export default function CommentSection({
	userID,
	listID,
	initialCommentData,
	commentInputActive,
}: props) {
	const [commentData, setCommentData] = useState<TComment[]>(
		initialCommentData.commentData,
	);
	const [loadMoreActive, setLoadMoreActive] = useState<boolean>(
		initialCommentData.next,
	);
	const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);

	const setNewComment = (newCommentData: TComment) => {
		setCommentData((prev) => [newCommentData, ...prev]);
	};

	const loadMoreClick = async () => {
		if (!loadMoreActive) {
			return;
		}
		setLoadMoreLoading(true);

		const { commentData: newCommentData, next } = await getComments(
			listID,
			commentData[commentData.length - 1].id,
		);
		setCommentData((prev) => [...prev, ...newCommentData]);
		setLoadMoreActive(next);

		setLoadMoreLoading(false);
	};

	return (
		<div className="flex w-full flex-col items-center gap-2">
			{commentInputActive && (
				<CommentInput listID={listID} setNewComment={setNewComment} />
			)}
			<div className="flex w-full flex-col gap-2">
				{commentData.map((data) => (
					<Comment
						key={data.id}
						userID={userID}
						listID={listID}
						commentData={data}
					/>
				))}
			</div>
			{loadMoreActive && (
				<Button
					disableRipple={true}
					spinnerPlacement="end"
					className="h-4 bg-transparent text-xs text-ml-white sm:text-sm"
					onClick={loadMoreClick}
					isLoading={loadMoreLoading}
				>
					Load more
				</Button>
			)}
		</div>
	);
}
