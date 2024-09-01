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

	let timeValue = searchParams.get("time") || "all";
	if (!keyData.includes(timeValue)) {
		timeValue = "all";
	}

	return (
		<Select
			size="sm"
			variant="bordered"
			selectionMode="single"
			defaultSelectedKeys={[timeValue]}
			onChange={selectionChangeHandler}
			disallowEmptySelection={true}
			className="w-1/3 max-w-[140px]"
			classNames={{
				mainWrapper: "text-ml-white border-ml-white",
				trigger: [
					"border-ml-white data-[focus=true]:border-ml-white data-[hover=true]:border-ml-white/50 data-[open=true]:border-ml-white/50",
					"flex-row-reverse",
				],

				value: "text-ml-white text-right mr-1",
				selectorIcon: "static",
			}}
			popoverProps={{
				classNames: {
					content: "bg-ml-white text-ml-black",
				},
			}}
			listboxProps={{
				itemClasses: {
					base: "data-[selectable=true]:focus:bg-gray-300",
				},
			}}
		>
			{keyData.map((key, index) => (
				<SelectItem key={key}>{textData[index]}</SelectItem>
			))}
		</Select>
	);
}
