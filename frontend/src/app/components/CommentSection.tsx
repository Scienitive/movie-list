"use client";

import Comment from "@/app/components/Comment";
import { useEffect, useState } from "react";
import { TComment } from "@/app/components/types";
import CommentInput from "@/app/components/CommentInput";

type props = {
	initialCommentData: TComment[];
	commentInputActive: boolean;
};

export default function CommentSection({
	initialCommentData,
	commentInputActive,
}: props) {
	const [commentData, setCommentData] =
		useState<TComment[]>(initialCommentData);

	return (
		<div className="flex w-full flex-col gap-4">
			{commentInputActive && <CommentInput />}
			<div className="flex flex-col">
				{commentData.map((data) => (
					<Comment key={data.id} commentData={data} />
				))}
			</div>
		</div>
	);
}
