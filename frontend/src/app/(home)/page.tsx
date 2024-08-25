import MyTabs from "@/app/components/MyTabs";
import MySelect from "@/app/components/MySelect";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import AddListWrapper from "@/app/components/AddListWrapper";
import ListCard from "@/app/components/ListCard";
import { getUsername } from "@/app/components/actions";
import to from "await-to-js";
import InfiniteScroll from "@/app/components/InfiniteScroll";
import { getListData } from "@/app/(home)/actions";

export default async function HomePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const sortParam: string = (searchParams?.sort as string) || "new";
	const timeParam: string = (searchParams?.time as string) || "all";

	const data = await getListData(sortParam, timeParam, 0);

	const [err, username] = await to(getUsername());

	return (
		<main className="mt-4 flex grow flex-col items-center gap-4">
			<div className="flex w-11/12 items-center justify-between md:w-4/5 lg:w-3/5">
				<MyTabs
					tabNames={["New", "Most Liked"]}
					queryNames={["new", "top"]}
					currentValue={sortParam}
				/>
				{sortParam === "top" && <MySelect />}
			</div>
			<Suspense
				key={sortParam + timeParam}
				fallback={
					<div className="flex grow flex-col justify-center">
						<Spinner
							size="lg"
							classNames={{
								circle1: "border-b-ml-red",
								circle2: "border-b-ml-red",
							}}
						/>
					</div>
				}
			>
				<div className="flex w-full flex-col items-center gap-8">
					{username && <AddListWrapper username={username} />}
					{data?.map((json) => (
						<ListCard
							key={json.id}
							postId={json.id}
							authorUserId={json.user_id}
							username={json.profiles.username}
							title={json.title}
							movies={json.movies}
							likeCount={json.likes[0].count}
						/>
					))}
					<InfiniteScroll />
				</div>
			</Suspense>
		</main>
	);
}
