"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type props = {
	tabNames: string[];
	queryNames: string[];
	currentValue: string;
};

export default function MyTabs({ tabNames, queryNames, currentValue }: props) {
	if (tabNames.length !== queryNames.length) {
		throw new Error(
			"tabNames and queryNames should have the same number of entries.",
		);
	} else if (!queryNames.includes(currentValue)) {
		throw new Error("currentValue must be in the queryNames.");
	}

	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const selectionChangeHandler = (newValue: React.Key) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		if (newValue.toString() === "new") {
			newSearchParams.delete("time");
		}
		newSearchParams.set("sort", newValue.toString());
		router.push(`${pathname}?${newSearchParams}`);
	};

	return (
		<Tabs
			size="sm"
			variant="bordered"
			defaultSelectedKey={currentValue}
			onSelectionChange={selectionChangeHandler}
			classNames={{
				tabList: "border-1 border-ml-white",
				cursor: "bg-ml-red",
				tabContent: "text-ml-white group-data-[selected=true]:text-ml-black",
			}}
		>
			{tabNames.map((name, index) => (
				<Tab key={queryNames[index]} title={name} />
			))}
		</Tabs>
	);
}
