import ListCard from "../components/ListCard";
import MyTabs from "@/app/components/MyTabs";
import MySelect from "@/app/components/MySelect";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import to from "await-to-js";
import { pb } from "@/utils/pocketbase/client";

export default async function HomePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const sortParam: string = (searchParams?.sort as string) || "new";
	const timeParam: string = (searchParams?.time as string) || "all";

	// let filter, sort;
	// if (sortParam === "top") {
	// 	sort:
	// } else {
	// 	orderId = "created_at";
	// 	orderOptions = { ascending: false };
	// }

	pb.authStore.loadFromCookie("pb_auth");
	const [error, data] = await to(
		pb.collection("likes").getList(1, 4, {
			expand: "user",
		}),
	);
	console.log("o");
	console.log(data);

	// const query = supabase
	// 	.from("lists")
	// 	.select(
	// 		"id, user_id, title, movies, profiles!lists_user_id_fkey(username), likes(count)",
	// 	)
	// 	.order(orderId, orderOptions);
	//
	// if (sortParam === "top") {
	// 	if (timeParam === "week") {
	// 		const now = new Date();
	// 		const oneWeekAgo = new Date(
	// 			now.getFullYear(),
	// 			now.getMonth(),
	// 			now.getDate() - 7,
	// 			now.getHours(),
	// 			now.getMinutes(),
	// 		);
	// 		query.gt("created_at", oneWeekAgo.toISOString());
	// 	} else if (timeParam == "month") {
	// 		const now = new Date();
	// 		const oneMonthAgo = new Date(
	// 			now.getFullYear(),
	// 			now.getMonth() - 1,
	// 			now.getDate(),
	// 			now.getHours(),
	// 			now.getMinutes(),
	// 		);
	// 		query.gt("created_at", oneMonthAgo.toISOString());
	// 	}
	// }
	//
	// const { data, error } = await query.range(0, 4);
	// if (error) {
	// 	throw new Error("Can't connect to database right now :(");
	// }

	return <p className="text-ml-white">ASDSADASDSD</p>;
	// return (
	// 	<main className="mt-4 flex grow flex-col items-center gap-4">
	// 		<div className="flex w-3/5 items-center justify-between">
	// 			<MyTabs
	// 				tabNames={["New", "Most Liked"]}
	// 				queryNames={["new", "top"]}
	// 				currentValue={sortParam}
	// 			/>
	// 			{sortParam === "top" && <MySelect />}
	// 		</div>
	// 		<Suspense
	// 			key={sortParam + timeParam}
	// 			fallback={
	// 				<div className="mb-8 flex grow flex-col justify-center">
	// 					<Spinner
	// 						size="lg"
	// 						classNames={{
	// 							circle1: "border-b-ml-red",
	// 							circle2: "border-b-ml-red",
	// 						}}
	// 					/>
	// 				</div>
	// 			}
	// 		>
	// 			<div className="flex w-full flex-col items-center gap-8">
	// 				{data?.map((json) => (
	// 					<ListCard
	// 						key={json.id}
	// 						postId={json.id}
	// 						authorUserId={json.user_id}
	// 						username={json.profiles.username}
	// 						title={json.title}
	// 						movies={json.movies}
	// 						likeCount={json.likes[0].count}
	// 					/>
	// 				))}
	// 			</div>
	// 		</Suspense>
	// 	</main>
	// );
}
