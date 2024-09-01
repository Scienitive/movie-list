"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@nextui-org/react";
import { FaTrashAlt } from "react-icons/fa";
import to from "await-to-js";
import { deleteComment } from "@/app/components/actions";

type props = {
	commentID: number;
	setDeleted?: Function;
	setReplyDeleted?: Function;
};

export default function DeleteCommentButton({
	commentID,
	setDeleted,
	setReplyDeleted,
}: props) {
	const [popoverState, setPopoverState] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const handleDelete = async () => {
		setLoading(true);

		const [error] = await to(deleteComment(commentID));
		if (error) {
			toast.error("Error while deleting the comment.", {
				id: "DeleteCommentError",
			});
			setLoading(false);
			return;
		}

		toast.success("Comment deletion successful!", {
			id: "DeleteCommentSuccess",
		});
		if (setDeleted) {
			setDeleted(true);
		} else if (setReplyDeleted) {
			setReplyDeleted();
		}
		setLoading(false);
		setPopoverState(false);
	};

	return (
		<Popover isOpen={popoverState} backdrop="opaque">
			<PopoverTrigger>
				<Button
					onClick={() => {
						setPopoverState(!popoverState);
					}}
					disableRipple={true}
					className="h-6 min-h-6 w-6 min-w-6 bg-transparent px-0 text-ml-white"
				>
					<FaTrashAlt className="text-sm" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="border-1 bg-ml-black text-ml-white">
				<div className="flex flex-col gap-2">
					<div>
						<p className="text-sm font-bold">Are you sure?</p>
						<p className="text-xs font-light">This action is irreversible.</p>
					</div>
					<div className="mb-1 flex flex-col justify-center gap-2">
						<Button
							onClick={handleDelete}
							isLoading={loading}
							className="bg-ml-red"
						>
							Delete
						</Button>
						<Button
							onClick={() => {
								setPopoverState(false);
							}}
						>
							Go Back
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
