"use client";

import { Divider } from "@nextui-org/react";
import NoAuthLikeButton from "@/app/components/NoAuthLikeButton";
import LikeButton from "./LikeButton";
import DeleteListButton from "./DeleteListButton";
import NoAuthCommentButton from "@/app/components/NoAuthCommentButton";
import CommentButton from "@/app/components/CommentButton";
import CommentSection from "@/app/components/CommentSection";
import { TComment } from "@/app/components/types";
import { useState } from "react";

type props = {
	userID: string | undefined;
	authorUserId: string;
	postId: number;
	likeCount: number;
	userLike: boolean;
	initialCommentData: { commentData: TComment[]; next: boolean };
};

export default function ListCardFooterContent({
	userID,
	authorUserId,
	postId,
	likeCount,
	userLike,
	initialCommentData,
}: props) {
	const [commentInputActive, setCommentInputActive] = useState<boolean>(false);

	return (
		<>
			<div className="flex w-full justify-between">
				<div className="flex flex-row gap-4 sm:gap-8">
					{userID ? (
						<LikeButton
							key={postId}
							postId={postId}
							likeCount={likeCount}
							didUserLike={userLike}
						/>
					) : (
						<NoAuthLikeButton likeCount={likeCount} />
					)}
					{userID ? (
						<CommentButton setCommentActive={setCommentInputActive} />
					) : (
						<NoAuthCommentButton />
					)}
				</div>
				{userID && userID === authorUserId && (
					<DeleteListButton postId={postId} />
				)}
			</div>
			{(initialCommentData.commentData.length > 0 || commentInputActive) && (
				<Divider className="mb-3 mt-1 bg-ml-white sm:mb-3 sm:mt-3" />
			)}
			<CommentSection
				key={postId}
				userID={userID}
				listID={postId}
				initialCommentData={initialCommentData}
				commentInputActive={commentInputActive}
			/>
		</>
	);
}
