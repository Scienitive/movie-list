"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function MySelect() {
	const textData = ["Last week", "Last month", "All time"];
	const keyData = ["week", "month", "all"];

	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const selectionChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newValue = e.target.value;
		const newSearchParams = new URLSearchParams(searchParams.toString());
		newSearchParams.set("time", newValue.toString());
		router.push(`${pathname}?${newSearchParams}`);
	};

	console.log(searchParams.get("time"));
	let timeValue = searchParams.get("time") || "all";
	if (!keyData.includes(timeValue)) {
		timeValue = "all";
	}

	return (
		<Select
			selectionMode="single"
			defaultSelectedKeys={[timeValue]}
			className="w-1/6"
			onChange={selectionChangeHandler}
			disallowEmptySelection={true}
		>
			{keyData.map((key, index) => (
				<SelectItem key={key}>{textData[index]}</SelectItem>
			))}
		</Select>
	);
}
