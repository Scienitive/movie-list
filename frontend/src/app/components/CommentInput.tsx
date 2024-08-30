import { Button } from "@nextui-org/react";
import { CgMailReply } from "react-icons/cg";

export default function CommentInput() {
	return (
		<div className="flex flex-row items-end rounded-lg bg-ml-white/10 px-4 py-1">
			<textarea
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
			>
				<CgMailReply className="text-sm" />
			</Button>
		</div>
	);
}
