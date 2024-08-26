import HomeContent from "@/app/(home)/HomeContent";
import to from "await-to-js";
import { getUsername } from "@/app/components/actions";

export default async function ProfilePage({
	searchParams,
	params,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
	params: { slug: string };
}) {
	const sortParam: string = (searchParams?.sort as string) || "new";
	const timeParam: string = (searchParams?.time as string) || "all";

	let addList = false;
	const [err, username] = await to(getUsername());
	if (username === params.slug) {
		addList = true;
	}

	return (
		<HomeContent
			sortParam={sortParam}
			timeParam={timeParam}
			slug={params.slug}
			addList={addList}
		/>
	);
}
