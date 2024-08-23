"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import ListCardInteractive from "@/app/components/ListCardInteractive";

type props = {
	apiToken: string;
	username: string;
};

export default function AddListWrapper({ apiToken, username }: props) {
	const [createList, setCreateList] = useState<boolean>(false);

	return (
		<div className="flex w-full flex-col items-center gap-8">
			{createList ? (
				<ListCardInteractive apiToken={apiToken} username={username} />
			) : (
				<Button
					isIconOnly={true}
					className="border-2 bg-ml-white/20 sm:w-1/12"
					onClick={() => {
						setCreateList(true);
					}}
				>
					<FaPlus className="text-ml-white sm:text-2xl" />
				</Button>
			)}
		</div>
	);
}
