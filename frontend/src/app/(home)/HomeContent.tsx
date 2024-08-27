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

type props = {
	sortParam: string;
	timeParam: string;
	slug: string;
	addList: boolean;
	profileData?: {
		totalListCount: number | null;
		totalLikeCount: number | null;
	};
};

export default async function HomeContent({
	sortParam,
	timeParam,
	slug,
	addList,
	profileData,
}: props) {
	const data = await getListData(sortParam, timeParam, 0, slug);

	const [err, username] = await to(getUsername());

	const profileDataComponent = (
		<div className="mb-1 flex flex-row justify-center gap-24">
			<div className="flex flex-col items-center justify-center gap-1">
				<h2 className="text-xl text-ml-white">Total Lists</h2>
				<div className="flex aspect-square justify-center rounded-full border-1 border-ml-white">
					<p className="p-1 text-lg text-ml-red">
						{profileData?.totalListCount}
					</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center gap-1">
				<h2 className="text-xl text-ml-white">Total Likes</h2>
				<div className="flex aspect-square justify-center rounded-full border-1 border-ml-white">
					<p className="p-1 text-lg text-ml-red">
						{profileData?.totalLikeCount}
					</p>
				</div>
			</div>
		</div>
	);

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
				{profileData && profileDataComponent}
				<div className="flex w-full flex-col items-center gap-8">
					{addList && username && <AddListWrapper username={username} />}
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
