import { createClient } from "@/utils/supabase/server";
import ListCard from "./components/ListCard";

export default async function Home() {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("lists")
		.select("id, user_id, title, movies, profiles!lists_user_id_fkey(username)")
		.range(0, 4);
	if (error) {
		console.error(error);
		return;
	}

	return (
		<main className="flex flex-col items-center gap-8">
			{data?.map((json) => (
				<ListCard
					key={json.id}
					postId={json.id}
					authorUserId={json.user_id}
					username={json.profiles.username}
					title={json.title}
					movies={json.movies}
				/>
			))}
		</main>
	);
}
