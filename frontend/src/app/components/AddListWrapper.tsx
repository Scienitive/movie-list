"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import ListCardInteractive from "@/app/components/ListCardInteractive";

type props = {
	username: string;
};

export default function AddListWrapper({ username }: props) {
	const [createList, setCreateList] = useState<boolean>(false);

	return (
		<div className="flex w-full flex-col items-center gap-8">
			{createList ? (
				<ListCardInteractive
					username={username}
					setCreateList={setCreateList}
				/>
			) : (
				<Button
					isIconOnly={true}
					className="-mb-4 w-[120px] border-2 bg-ml-white/20"
					onClick={() => {
						setCreateList(true);
					}}
				>
					<FaPlus className="text-2xl text-ml-white" />
				</Button>
			)}
		</div>
	);
}
