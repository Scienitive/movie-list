import { createClient } from "@/utils/supabase/server";
import ListCard from "../components/ListCard";
import MyTabs from "@/app/components/MyTabs";
import MySelect from "@/app/components/MySelect";

export default async function HomePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const supabase = createClient();

	const sortParam = searchParams?.sort || "new";
	const timeParam = searchParams?.time || "all";

	let orderId, orderOptions;
	if (sortParam === "top") {
		orderId = "like_count";
		orderOptions = { ascending: false };
	} else {
		orderId = "created_at";
		orderOptions = { ascending: false };
	}

	const query = supabase
		.from("lists")
		.select(
			"id, user_id, title, movies, profiles!lists_user_id_fkey(username), likes(count)",
		)
		.order(orderId, orderOptions);

	if (sortParam === "top") {
		if (timeParam === "week") {
			const now = new Date();
			const oneWeekAgo = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate() - 7,
				now.getHours(),
				now.getMinutes(),
			);
			query.gt("created_at", oneWeekAgo.toISOString());
		} else if (timeParam == "month") {
			const now = new Date();
			const oneMonthAgo = new Date(
				now.getFullYear(),
				now.getMonth() - 1,
				now.getDate(),
				now.getHours(),
				now.getMinutes(),
			);
			query.gt("created_at", oneMonthAgo.toISOString());
		}
	}

	const { data, error } = await query.range(0, 4);

	if (error) {
		console.error(error);
		return;
	}

	return (
		<main className="flex flex-col items-center gap-8">
			<div className="flex w-3/5 justify-between">
				<MyTabs
					tabNames={["New", "Most Liked"]}
					queryNames={["new", "top"]}
					currentValue={sortParam}
				/>
				{sortParam === "top" && <MySelect />}
			</div>
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
		</main>
	);
}
