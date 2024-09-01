import HomeContent from "@/app/(home)/HomeContent";

export default async function HomePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const sortParam: string = (searchParams?.sort as string) || "new";
	const timeParam: string = (searchParams?.time as string) || "all";

	return (
		<HomeContent
			sortParam={sortParam}
			timeParam={timeParam}
			slug=""
			addList={true}
		/>
	);
}
