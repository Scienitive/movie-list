"use client";

import {
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@nextui-org/react";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { deleteList } from "./actions";

type props = {
	postId: number;
};

export default function DeleteListButton({ postId }: props) {
	const [popoverState, setPopoverState] = useState<boolean>(false);

	const handleDelete = async () => {
		await deleteList(postId);
	};

	return (
		<Popover isOpen={popoverState} backdrop="opaque">
			<PopoverTrigger>
				<Button
					onClick={() => {
						setPopoverState(!popoverState);
					}}
					disableRipple={true}
					className="bg-transparent text-ml-white"
				>
					<FaTrashAlt size={120} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="border-1 bg-ml-black text-ml-white">
				<div className="flex flex-col gap-2">
					<div>
						<p className="text-sm font-bold">Are you sure?</p>
						<p className="text-xs font-light">This action is irreversible.</p>
					</div>
					<div className="mb-1 flex flex-col justify-center gap-2">
						<Button onClick={handleDelete} className="bg-ml-red">
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
